import prisma from '../config/db.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js';

export const createPlacementRecord = async (req, res) => {
  try {
    const {
      programId,
      placementYear,
      totalStudents,
      eligibleStudents,
      studentsPlaced,
      highestPackage,
      averagePackage
    } = req.body;

    // Check if placement record already exists for this program and year
    const existingRecord = await prisma.placementRecord.findFirst({
      where: {
        programId,
        placementYear: parseInt(placementYear)
      }
    });

    if (existingRecord) {
      return errorResponse(res, 'Placement record already exists for this program and year', 409);
    }

    const placementRecord = await prisma.placementRecord.create({
      data: {
        programId,
        placementYear: parseInt(placementYear),
        totalStudents: parseInt(totalStudents),
        eligibleStudents: parseInt(eligibleStudents),
        studentsPlaced: parseInt(studentsPlaced),
        highestPackage: parseFloat(highestPackage),
        averagePackage: parseFloat(averagePackage)
      },
      include: {
        program: {
          select: {
            id: true,
            name: true,
            programType: true
          }
        }
      }
    });

    return successResponse(res, placementRecord, 'Placement record created successfully', 201);
  } catch (error) {
    console.error('Create placement record error:', error);
    return errorResponse(res, 'Failed to create placement record', 500);
  }
};

export const getAllPlacementRecords = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      programId, 
      placementYear,
      minPackage,
      maxPackage 
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (programId) {
      where.programId = programId;
    }
    if (placementYear) {
      where.placementYear = parseInt(placementYear);
    }
    if (minPackage) {
      where.averagePackage = { gte: parseFloat(minPackage) };
    }
    if (maxPackage) {
      where.averagePackage = { ...where.averagePackage, lte: parseFloat(maxPackage) };
    }

    const [placementRecords, total] = await Promise.all([
      prisma.placementRecord.findMany({
        where,
        include: {
          program: {
            select: {
              id: true,
              name: true,
              programType: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { placementYear: 'desc' }
      }),
      prisma.placementRecord.count({ where })
    ]);

    // Calculate placement percentage for each record
    const recordsWithPercentage = placementRecords.map(record => ({
      ...record,
      placementPercentage: record.eligibleStudents > 0 
        ? ((record.studentsPlaced / record.eligibleStudents) * 100).toFixed(2)
        : 0
    }));

    return paginatedResponse(res, recordsWithPercentage, parseInt(page), parseInt(limit), total, 'Placement records retrieved successfully');
  } catch (error) {
    console.error('Get placement records error:', error);
    return errorResponse(res, 'Failed to get placement records', 500);
  }
};

export const getPlacementRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const placementRecord = await prisma.placementRecord.findUnique({
      where: { id: parseInt(id) },
      include: {
        program: {
          include: {
            students: {
              select: {
                id: true,
                fullName: true,
                admissionStatus: true
              }
            }
          }
        }
      }
    });

    if (!placementRecord) {
      return errorResponse(res, 'Placement record not found', 404);
    }

    // Calculate additional metrics
    const placementPercentage = placementRecord.eligibleStudents > 0 
      ? ((placementRecord.studentsPlaced / placementRecord.eligibleStudents) * 100).toFixed(2)
      : 0;

    const enhancedRecord = {
      ...placementRecord,
      placementPercentage,
      packageRange: placementRecord.highestPackage - placementRecord.averagePackage
    };

    return successResponse(res, enhancedRecord, 'Placement record retrieved successfully');
  } catch (error) {
    console.error('Get placement record error:', error);
    return errorResponse(res, 'Failed to get placement record', 500);
  }
};

export const updatePlacementRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      placementYear,
      totalStudents,
      eligibleStudents,
      studentsPlaced,
      highestPackage,
      averagePackage
    } = req.body;

    const updateData = {};
    if (placementYear) updateData.placementYear = parseInt(placementYear);
    if (totalStudents) updateData.totalStudents = parseInt(totalStudents);
    if (eligibleStudents) updateData.eligibleStudents = parseInt(eligibleStudents);
    if (studentsPlaced) updateData.studentsPlaced = parseInt(studentsPlaced);
    if (highestPackage) updateData.highestPackage = parseFloat(highestPackage);
    if (averagePackage) updateData.averagePackage = parseFloat(averagePackage);

    const placementRecord = await prisma.placementRecord.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        program: {
          select: {
            id: true,
            name: true,
            programType: true
          }
        }
      }
    });

    return successResponse(res, placementRecord, 'Placement record updated successfully');
  } catch (error) {
    console.error('Update placement record error:', error);
    return errorResponse(res, 'Failed to update placement record', 500);
  }
};

export const deletePlacementRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const placementRecord = await prisma.placementRecord.findUnique({
      where: { id: parseInt(id) }
    });

    if (!placementRecord) {
      return errorResponse(res, 'Placement record not found', 404);
    }

    await prisma.placementRecord.delete({
      where: { id: parseInt(id) }
    });

    return successResponse(res, null, 'Placement record deleted successfully');
  } catch (error) {
    console.error('Delete placement record error:', error);
    return errorResponse(res, 'Failed to delete placement record', 500);
  }
};

export const getPlacementStats = async (req, res) => {
  try {
    const { programId, year } = req.query;

    const where = {};
    if (programId) where.programId = programId;
    if (year) where.placementYear = parseInt(year);

    const [totalRecords, totalStudents, totalEligible, totalPlaced] = await Promise.all([
      prisma.placementRecord.count({ where }),
      prisma.placementRecord.aggregate({
        where,
        _sum: { totalStudents: true }
      }),
      prisma.placementRecord.aggregate({
        where,
        _sum: { eligibleStudents: true }
      }),
      prisma.placementRecord.aggregate({
        where,
        _sum: { studentsPlaced: true }
      })
    ]);

    const avgPackage = await prisma.placementRecord.aggregate({
      where,
      _avg: { averagePackage: true }
    });

    const maxPackage = await prisma.placementRecord.aggregate({
      where,
      _max: { highestPackage: true }
    });

    const yearStats = await prisma.placementRecord.groupBy({
      by: ['placementYear'],
      where,
      _sum: {
        totalStudents: true,
        eligibleStudents: true,
        studentsPlaced: true
      },
      _avg: {
        averagePackage: true,
        highestPackage: true
      }
    });

    const programStats = await prisma.placementRecord.groupBy({
      by: ['programId'],
      where,
      _sum: {
        totalStudents: true,
        eligibleStudents: true,
        studentsPlaced: true
      },
      _avg: {
        averagePackage: true,
        highestPackage: true
      },
      include: {
        program: {
          select: {
            name: true,
            programType: true
          }
        }
      }
    });

    const overallPlacementPercentage = totalEligible._sum.eligibleStudents > 0
      ? ((totalPlaced._sum.studentsPlaced / totalEligible._sum.eligibleStudents) * 100).toFixed(2)
      : 0;

    return successResponse(res, {
      totalRecords,
      totalStudents: totalStudents._sum.totalStudents || 0,
      totalEligible: totalEligible._sum.eligibleStudents || 0,
      totalPlaced: totalPlaced._sum.studentsPlaced || 0,
      overallPlacementPercentage,
      averagePackage: avgPackage._avg.averagePackage || 0,
      highestPackage: maxPackage._max.highestPackage || 0,
      yearStats,
      programStats
    }, 'Placement statistics retrieved successfully');
  } catch (error) {
    console.error('Get placement stats error:', error);
    return errorResponse(res, 'Failed to get placement statistics', 500);
  }
};

export const getTopPerformingPrograms = async (req, res) => {
  try {
    const { limit = 5, year } = req.query;

    const where = {};
    if (year) where.placementYear = parseInt(year);

    const topPrograms = await prisma.placementRecord.findMany({
      where,
      include: {
        program: {
          select: {
            name: true,
            programType: true
          }
        }
      },
      orderBy: { averagePackage: 'desc' },
      take: parseInt(limit)
    });

    const programsWithPercentage = topPrograms.map(record => ({
      ...record,
      placementPercentage: record.eligibleStudents > 0 
        ? ((record.studentsPlaced / record.eligibleStudents) * 100).toFixed(2)
        : 0
    }));

    return successResponse(res, programsWithPercentage, 'Top performing programs retrieved successfully');
  } catch (error) {
    console.error('Get top performing programs error:', error);
    return errorResponse(res, 'Failed to get top performing programs', 500);
  }
}; 