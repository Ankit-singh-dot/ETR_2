import prisma from '../config/db.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js';

export const createCollaboration = async (req, res) => {
  try {
    const {
      industryName,
      programId,
      companyName,
      internshipMOU,
      type,
      yearOfSetup
    } = req.body;

    const collaboration = await prisma.collaboration.create({
      data: {
        industryName,
        programId,
        companyName,
        internshipMOU,
        type,
        yearOfSetup: yearOfSetup ? parseInt(yearOfSetup) : null
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

    return successResponse(res, collaboration, 'Collaboration created successfully', 201);
  } catch (error) {
    console.error('Create collaboration error:', error);
    return errorResponse(res, 'Failed to create collaboration', 500);
  }
};

export const getAllCollaborations = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      programId, 
      type,
      industryName 
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { industryName: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (programId) {
      where.programId = programId;
    }
    if (type) {
      where.type = type;
    }
    if (industryName) {
      where.industryName = industryName;
    }

    const [collaborations, total] = await Promise.all([
      prisma.collaboration.findMany({
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
        orderBy: { createdAt: 'desc' }
      }),
      prisma.collaboration.count({ where })
    ]);

    return paginatedResponse(res, collaborations, parseInt(page), parseInt(limit), total, 'Collaborations retrieved successfully');
  } catch (error) {
    console.error('Get collaborations error:', error);
    return errorResponse(res, 'Failed to get collaborations', 500);
  }
};

export const getCollaborationById = async (req, res) => {
  try {
    const { id } = req.params;

    const collaboration = await prisma.collaboration.findUnique({
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

    if (!collaboration) {
      return errorResponse(res, 'Collaboration not found', 404);
    }

    return successResponse(res, collaboration, 'Collaboration retrieved successfully');
  } catch (error) {
    console.error('Get collaboration error:', error);
    return errorResponse(res, 'Failed to get collaboration', 500);
  }
};

export const updateCollaboration = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      industryName,
      companyName,
      internshipMOU,
      type,
      yearOfSetup
    } = req.body;

    const updateData = {};
    if (industryName) updateData.industryName = industryName;
    if (companyName) updateData.companyName = companyName;
    if (internshipMOU !== undefined) updateData.internshipMOU = internshipMOU;
    if (type) updateData.type = type;
    if (yearOfSetup !== undefined) updateData.yearOfSetup = yearOfSetup ? parseInt(yearOfSetup) : null;

    const collaboration = await prisma.collaboration.update({
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

    return successResponse(res, collaboration, 'Collaboration updated successfully');
  } catch (error) {
    console.error('Update collaboration error:', error);
    return errorResponse(res, 'Failed to update collaboration', 500);
  }
};

export const deleteCollaboration = async (req, res) => {
  try {
    const { id } = req.params;

    const collaboration = await prisma.collaboration.findUnique({
      where: { id: parseInt(id) }
    });

    if (!collaboration) {
      return errorResponse(res, 'Collaboration not found', 404);
    }

    await prisma.collaboration.delete({
      where: { id: parseInt(id) }
    });

    return successResponse(res, null, 'Collaboration deleted successfully');
  } catch (error) {
    console.error('Delete collaboration error:', error);
    return errorResponse(res, 'Failed to delete collaboration', 500);
  }
};

export const getCollaborationsByProgram = async (req, res) => {
  try {
    const { programId } = req.params;

    const collaborations = await prisma.collaboration.findMany({
      where: { programId },
      include: {
        program: {
          select: {
            id: true,
            name: true,
            programType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(res, collaborations, 'Program collaborations retrieved successfully');
  } catch (error) {
    console.error('Get collaborations by program error:', error);
    return errorResponse(res, 'Failed to get program collaborations', 500);
  }
};

export const getCollaborationStats = async (req, res) => {
  try {
    const [totalCollaborations, industryStats, typeStats, programStats] = await Promise.all([
      prisma.collaboration.count(),
      prisma.collaboration.groupBy({
        by: ['industryName'],
        _count: {
          id: true
        }
      }),
      prisma.collaboration.groupBy({
        by: ['type'],
        _count: {
          id: true
        }
      }),
      prisma.collaboration.groupBy({
        by: ['programId'],
        _count: {
          id: true
        },
        include: {
          program: {
            select: {
              name: true,
              programType: true
            }
          }
        }
      })
    ]);

    const yearStats = await prisma.collaboration.groupBy({
      by: ['yearOfSetup'],
      _count: {
        id: true
      }
    });

    const recentCollaborations = await prisma.collaboration.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        program: {
          select: {
            name: true
          }
        }
      }
    });

    return successResponse(res, {
      totalCollaborations,
      industryStats,
      typeStats,
      programStats,
      yearStats,
      recentCollaborations
    }, 'Collaboration statistics retrieved successfully');
  } catch (error) {
    console.error('Get collaboration stats error:', error);
    return errorResponse(res, 'Failed to get collaboration statistics', 500);
  }
};

export const searchCollaborations = async (req, res) => {
  try {
    const { query, type, industryName } = req.query;

    const where = {};
    if (query) {
      where.OR = [
        { industryName: { contains: query, mode: 'insensitive' } },
        { companyName: { contains: query, mode: 'insensitive' } },
        { internshipMOU: { contains: query, mode: 'insensitive' } }
      ];
    }
    if (type) {
      where.type = type;
    }
    if (industryName) {
      where.industryName = industryName;
    }

    const collaborations = await prisma.collaboration.findMany({
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
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(res, collaborations, 'Collaborations search completed successfully');
  } catch (error) {
    console.error('Search collaborations error:', error);
    return errorResponse(res, 'Failed to search collaborations', 500);
  }
}; 