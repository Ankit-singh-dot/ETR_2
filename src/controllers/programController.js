import prisma from '../config/db.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js';

export const createProgram = async (req, res) => {
  try {
    const { name, programType, durationYears, description } = req.body;

    const program = await prisma.program.create({
      data: {
        name,
        programType,
        durationYears,
        description
      }
    });

    return successResponse(res, program, 'Program created successfully', 201);
  } catch (error) {
    console.error('Create program error:', error);
    return errorResponse(res, 'Failed to create program', 500);
  }
};

export const getAllPrograms = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, programType } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (programType) {
      where.programType = programType;
    }

    const [programs, total] = await Promise.all([
      prisma.program.findMany({
        where,
        include: {
          seats: true,
          fees: true,
          eligibility: true,
          _count: {
            select: {
              students: true,
              placements: true,
              collaborations: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.program.count({ where })
    ]);

    return paginatedResponse(res, programs, parseInt(page), parseInt(limit), total, 'Programs retrieved successfully');
  } catch (error) {
    console.error('Get programs error:', error);
    return errorResponse(res, 'Failed to get programs', 500);
  }
};

export const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        seats: true,
        fees: true,
        eligibility: true,
        students: {
          include: {
            admissionTracking: true
          }
        },
        placements: true,
        collaborations: true
      }
    });

    if (!program) {
      return errorResponse(res, 'Program not found', 404);
    }

    return successResponse(res, program, 'Program retrieved successfully');
  } catch (error) {
    console.error('Get program error:', error);
    return errorResponse(res, 'Failed to get program', 500);
  }
};

export const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, programType, durationYears, description } = req.body;

    const program = await prisma.program.update({
      where: { id },
      data: {
        name,
        programType,
        durationYears,
        description
      }
    });

    return successResponse(res, program, 'Program updated successfully');
  } catch (error) {
    console.error('Update program error:', error);
    return errorResponse(res, 'Failed to update program', 500);
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if program has related data
    const programWithRelations = await prisma.program.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            seats: true,
            fees: true,
            eligibility: true,
            placements: true,
            collaborations: true
          }
        }
      }
    });

    if (!programWithRelations) {
      return errorResponse(res, 'Program not found', 404);
    }

    // Check if program has students *************
    if (programWithRelations._count.students > 0) {
      return errorResponse(res, 'Cannot delete program with enrolled students', 400);
    }

    await prisma.program.delete({
      where: { id }
    });

    return successResponse(res, null, 'Program deleted successfully');
  } catch (error) {
    console.error('Delete program error:', error);
    return errorResponse(res, 'Failed to delete program', 500);
  }
};

export const getProgramStats = async (req, res) => {
  try {
    const { id } = req.params;

    const stats = await prisma.program.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            seats: true,
            placements: true,
            collaborations: true
          }
        },
        seats: {
          select: {
            totalSeats: true,
            reservedSeats: true,
            openSeats: true
          }
        },
        students: {
          select: {
            admissionStatus: true
          }
        }
      }
    });

    if (!stats) {
      return errorResponse(res, 'Program not found', 404);
    }

    // Calculate additional stats
    const admissionStatusCounts = stats.students.reduce((acc, student) => {
      acc[student.admissionStatus] = (acc[student.admissionStatus] || 0) + 1;
      return acc;
    }, {});

    const totalSeats = stats.seats.reduce((sum, seat) => sum + seat.totalSeats, 0);
    const totalReserved = stats.seats.reduce((sum, seat) => sum + seat.reservedSeats, 0);
    const totalOpen = stats.seats.reduce((sum, seat) => sum + seat.openSeats, 0);

    const programStats = {
      ...stats,
      admissionStatusCounts,
      seatStats: {
        totalSeats,
        totalReserved,
        totalOpen,
        utilizationRate: totalSeats > 0 ? ((totalSeats - totalOpen) / totalSeats * 100).toFixed(2) : 0
      }
    };

    return successResponse(res, programStats, 'Program statistics retrieved successfully');
  } catch (error) {
    console.error('Get program stats error:', error);
    return errorResponse(res, 'Failed to get program statistics', 500);
  }
};

// Program Seat Management
export const createProgramSeat = async (req, res) => {
  try {
    const { totalSeats, reservedSeats, openSeats, programId } = req.body;

    // Validate that totalSeats = reservedSeats + openSeats
    if (totalSeats !== reservedSeats + openSeats) {
      return errorResponse(res, 'Total seats must equal reserved seats plus open seats', 400);
    }

    const seat = await prisma.programSeat.create({
      data: {
        totalSeats,
        reservedSeats,
        openSeats,
        programId
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

    return successResponse(res, seat, 'Program seat created successfully', 201);
  } catch (error) {
    console.error('Create program seat error:', error);
    return errorResponse(res, 'Failed to create program seat', 500);
  }
};

export const updateProgramSeat = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalSeats, reservedSeats, openSeats } = req.body;

    // Validate that totalSeats = reservedSeats + openSeats
    if (totalSeats !== reservedSeats + openSeats) {
      return errorResponse(res, 'Total seats must equal reserved seats plus open seats', 400);
    }

    const seat = await prisma.programSeat.update({
      where: { id: parseInt(id) },
      data: {
        totalSeats,
        reservedSeats,
        openSeats
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

    return successResponse(res, seat, 'Program seat updated successfully');
  } catch (error) {
    console.error('Update program seat error:', error);
    return errorResponse(res, 'Failed to update program seat', 500);
  }
};

export const deleteProgramSeat = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if seat has assigned students
    const seatWithStudents = await prisma.programSeat.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            students: true
          }
        }
      }
    });

    if (!seatWithStudents) {
      return errorResponse(res, 'Program seat not found', 404);
    }

    if (seatWithStudents._count.students > 0) {
      return errorResponse(res, 'Cannot delete seat with assigned students', 400);
    }

    await prisma.programSeat.delete({
      where: { id: parseInt(id) }
    });

    return successResponse(res, null, 'Program seat deleted successfully');
  } catch (error) {
    console.error('Delete program seat error:', error);
    return errorResponse(res, 'Failed to delete program seat', 500);
  }
};

// Eligibility Criteria Management
export const createEligibilityCriteria = async (req, res) => {
  try {
    const { minQualification, minPercentage, entranceExamName, programId } = req.body;

    const criteria = await prisma.eligibilityCriteria.create({
      data: {
        minQualification,
        minPercentage: parseFloat(minPercentage),
        entranceExamName,
        programId
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

    return successResponse(res, criteria, 'Eligibility criteria created successfully', 201);
  } catch (error) {
    console.error('Create eligibility criteria error:', error);
    return errorResponse(res, 'Failed to create eligibility criteria', 500);
  }
};

export const updateEligibilityCriteria = async (req, res) => {
  try {
    const { id } = req.params;
    const { minQualification, minPercentage, entranceExamName } = req.body;

    const criteria = await prisma.eligibilityCriteria.update({
      where: { id: parseInt(id) },
      data: {
        minQualification,
        minPercentage: parseFloat(minPercentage),
        entranceExamName
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

    return successResponse(res, criteria, 'Eligibility criteria updated successfully');
  } catch (error) {
    console.error('Update eligibility criteria error:', error);
    return errorResponse(res, 'Failed to update eligibility criteria', 500);
  }
};

export const deleteEligibilityCriteria = async (req, res) => {
  try {
    const { id } = req.params;

    const criteria = await prisma.eligibilityCriteria.findUnique({
      where: { id: parseInt(id) }
    });

    if (!criteria) {
      return errorResponse(res, 'Eligibility criteria not found', 404);
    }

    await prisma.eligibilityCriteria.delete({
      where: { id: parseInt(id) }
    });

    return successResponse(res, null, 'Eligibility criteria deleted successfully');
  } catch (error) {
    console.error('Delete eligibility criteria error:', error);
    return errorResponse(res, 'Failed to delete eligibility criteria', 500);
  }
}; 