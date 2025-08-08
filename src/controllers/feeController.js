import prisma from '../config/db.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js';

export const createFeeStructure = async (req, res) => {
  try {
    const {
      totalFee,
      optionalScholarshipFee,
      scholarshipAmount,
      netFee,
      programId
    } = req.body;


    const existingFee = await prisma.feeStructure.findFirst({
      where: { programId }
    });

    if (existingFee) {
      return errorResponse(res, 'Fee structure already exists for this program', 409);
    }

    const feeStructure = await prisma.feeStructure.create({
      data: {
        totalFee: parseFloat(totalFee),
        optionalScholarshipFee: optionalScholarshipFee ? parseFloat(optionalScholarshipFee) : null,
        scholarshipAmount: scholarshipAmount ? parseFloat(scholarshipAmount) : null,
        netFee: parseFloat(netFee),
        programId
      },
      include: {
        program: true
      }
    });

    return successResponse(res, feeStructure, 'Fee structure created successfully', 201);
  } catch (error) {
    console.error('Create fee structure error:', error);
    return errorResponse(res, 'Failed to create fee structure', 500);
  }
};

export const getAllFeeStructures = async (req, res) => {
  try {
    const { page = 1, limit = 10, programId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (programId) {
      where.programId = programId;
    }

    const [feeStructures, total] = await Promise.all([
      prisma.feeStructure.findMany({
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
      prisma.feeStructure.count({ where })
    ]);

    return paginatedResponse(res, feeStructures, parseInt(page), parseInt(limit), total, 'Fee structures retrieved successfully');
  } catch (error) {
    console.error('Get fee structures error:', error);
    return errorResponse(res, 'Failed to get fee structures', 500);
  }
};

export const getFeeStructureById = async (req, res) => {
  try {
    const { id } = req.params;

    const feeStructure = await prisma.feeStructure.findUnique({
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

    if (!feeStructure) {
      return errorResponse(res, 'Fee structure not found', 404);
    }

    return successResponse(res, feeStructure, 'Fee structure retrieved successfully');
  } catch (error) {
    console.error('Get fee structure error:', error);
    return errorResponse(res, 'Failed to get fee structure', 500);
  }
};

export const updateFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      totalFee,
      optionalScholarshipFee,
      scholarshipAmount,
      netFee
    } = req.body;

    const feeStructure = await prisma.feeStructure.update({
      where: { id: parseInt(id) },
      data: {
        totalFee: totalFee ? parseFloat(totalFee) : undefined,
        optionalScholarshipFee: optionalScholarshipFee !== undefined ? parseFloat(optionalScholarshipFee) : undefined,
        scholarshipAmount: scholarshipAmount !== undefined ? parseFloat(scholarshipAmount) : undefined,
        netFee: netFee ? parseFloat(netFee) : undefined
      },
      include: {
        program: true
      }
    });

    return successResponse(res, feeStructure, 'Fee structure updated successfully');
  } catch (error) {
    console.error('Update fee structure error:', error);
    return errorResponse(res, 'Failed to update fee structure', 500);
  }
};

export const deleteFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if fee structure has associated students
    const feeStructureWithStudents = await prisma.feeStructure.findUnique({
      where: { id: parseInt(id) },
      include: {
        program: {
          include: {
            _count: {
              select: {
                students: true
              }
            }
          }
        }
      }
    });

    if (!feeStructureWithStudents) {
      return errorResponse(res, 'Fee structure not found', 404);
    }

    if (feeStructureWithStudents.program._count.students > 0) {
      return errorResponse(res, 'Cannot delete fee structure with enrolled students', 400);
    }

    await prisma.feeStructure.delete({
      where: { id: parseInt(id) }
    });

    return successResponse(res, null, 'Fee structure deleted successfully');
  } catch (error) {
    console.error('Delete fee structure error:', error);
    return errorResponse(res, 'Failed to delete fee structure', 500);
  }
};

export const getFeeStructureByProgram = async (req, res) => {
  try {
    const { programId } = req.params;

    const feeStructure = await prisma.feeStructure.findFirst({
      where: { programId },
      include: {
        program: {
          select: {
            id: true,
            name: true,
            programType: true,
            durationYears: true
          }
        }
      }
    });

    if (!feeStructure) {
      return errorResponse(res, 'Fee structure not found for this program', 404);
    }

    return successResponse(res, feeStructure, 'Fee structure retrieved successfully');
  } catch (error) {
    console.error('Get fee structure by program error:', error);
    return errorResponse(res, 'Failed to get fee structure', 500);
  }
};

export const calculateScholarship = async (req, res) => {
  try {
    const { programId, studentPercentage } = req.body;

    const feeStructure = await prisma.feeStructure.findFirst({
      where: { programId },
      include: {
        program: {
          select: {
            name: true
          }
        }
      }
    });

    if (!feeStructure) {
      return errorResponse(res, 'Fee structure not found for this program', 404);
    }

    let scholarshipAmount = 0;
    let finalFee = feeStructure.totalFee;

    // Calculate scholarship based on percentage
    if (studentPercentage >= 90) {
      scholarshipAmount = feeStructure.totalFee * 0.25; 
    } else if (studentPercentage >= 80) {
      scholarshipAmount = feeStructure.totalFee * 0.15; 
    } else if (studentPercentage >= 70) {
      scholarshipAmount = feeStructure.totalFee * 0.10; 
    }

    finalFee = feeStructure.totalFee - scholarshipAmount;

    return successResponse(res, {
      program: feeStructure.program,
      totalFee: feeStructure.totalFee,
      studentPercentage,
      scholarshipAmount,
      finalFee,
      scholarshipPercentage: scholarshipAmount > 0 ? (scholarshipAmount / feeStructure.totalFee * 100).toFixed(2) : 0
    }, 'Scholarship calculated successfully');
  } catch (error) {
    console.error('Calculate scholarship error:', error);
    return errorResponse(res, 'Failed to calculate scholarship', 500);
  }
}; 