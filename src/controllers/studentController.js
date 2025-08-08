import prisma from '../config/db.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js';

export const createStudent = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      dob,
      gender,
      address,
      admissionYear,
      admissionStatus,
      programId,
      seatId
    } = req.body;

    // Generate admission number
    const admissionNumber = generateAdmissionNumber();

    const student = await prisma.student.create({
      data: {
        fullName,
        phone,
        dob: new Date(dob),
        gender,
        address,
        admissionYear,
        admissionStatus,
        admissionNumber,
        programId,
        seatId: seatId || null
      },
      include: {
        program: true,
        seat: true,
        userLogin: true
      }
    });

    return successResponse(res, student, 'Student created successfully', 201);
  } catch (error) {
    console.error('Create student error:', error);
    return errorResponse(res, 'Failed to create student', 500);
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      admissionStatus, 
      programId,
      admissionYear 
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { admissionNumber: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (admissionStatus) {
      where.admissionStatus = admissionStatus;
    }
    if (programId) {
      where.programId = programId;
    }
    if (admissionYear) {
      where.admissionYear = parseInt(admissionYear);
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          program: true,
          seat: true,
          userLogin: true,
          admissionTracking: {
            orderBy: { updatedAt: 'desc' }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.student.count({ where })
    ]);

    return paginatedResponse(res, students, parseInt(page), parseInt(limit), total, 'Students retrieved successfully');
  } catch (error) {
    console.error('Get students error:', error);
    return errorResponse(res, 'Failed to get students', 500);
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: {
        program: {
          include: {
            seats: true,
            fees: true,
            eligibility: true
          }
        },
        seat: true,
        userLogin: true,
        admissionTracking: {
          orderBy: { updatedAt: 'desc' }
        }
      }
    });

    if (!student) {
      return errorResponse(res, 'Student not found', 404);
    }

    return successResponse(res, student, 'Student retrieved successfully');
  } catch (error) {
    console.error('Get student error:', error);
    return errorResponse(res, 'Failed to get student', 500);
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Convert date string to Date object if present
    if (updateData.dob) {
      updateData.dob = new Date(updateData.dob);
    }

    const student = await prisma.student.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        program: true,
        seat: true,
        userLogin: true
      }
    });

    return successResponse(res, student, 'Student updated successfully');
  } catch (error) {
    console.error('Update student error:', error);
    return errorResponse(res, 'Failed to update student', 500);
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if student has admission tracking records
    const studentWithTracking = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            admissionTracking: true
          }
        }
      }
    });

    if (!studentWithTracking) {
      return errorResponse(res, 'Student not found', 404);
    }

    // Delete admission tracking records first
    if (studentWithTracking._count.admissionTracking > 0) {
      await prisma.admissionTracking.deleteMany({
        where: { studentId: parseInt(id) }
      });
    }

    await prisma.student.delete({
      where: { id: parseInt(id) }
    });

    return successResponse(res, null, 'Student deleted successfully');
  } catch (error) {
    console.error('Delete student error:', error);
    return errorResponse(res, 'Failed to delete student', 500);
  }
};

export const updateAdmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { admissionStatus } = req.body;

    const student = await prisma.student.update({
      where: { id: parseInt(id) },
      data: { admissionStatus },
      include: {
        program: true,
        seat: true
      }
    });

    return successResponse(res, student, 'Admission status updated successfully');
  } catch (error) {
    console.error('Update admission status error:', error);
    return errorResponse(res, 'Failed to update admission status', 500);
  }
};

export const addAdmissionTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, documentName, remarks } = req.body;
    const updatedBy = req.user.email;

    const tracking = await prisma.admissionTracking.create({
      data: {
        stage,
        documentName,
        remarks,
        updatedBy,
        studentId: parseInt(id)
      }
    });

    return successResponse(res, tracking, 'Admission tracking record added successfully', 201);
  } catch (error) {
    console.error('Add admission tracking error:', error);
    return errorResponse(res, 'Failed to add admission tracking record', 500);
  }
};

export const getStudentStats = async (req, res) => {
  try {
    const stats = await prisma.student.groupBy({
      by: ['admissionStatus'],
      _count: {
        id: true
      }
    });

    const totalStudents = await prisma.student.count();
    const programStats = await prisma.student.groupBy({
      by: ['programId'],
      _count: {
        id: true
      },
      include: {
        program: {
          select: {
            name: true
          }
        }
      }
    });

    const yearStats = await prisma.student.groupBy({
      by: ['admissionYear'],
      _count: {
        id: true
      }
    });

    return successResponse(res, {
      admissionStatusStats: stats,
      totalStudents,
      programStats,
      yearStats
    }, 'Student statistics retrieved successfully');
  } catch (error) {
    console.error('Get student stats error:', error);
    return errorResponse(res, 'Failed to get student statistics', 500);
  }
};

// Helper function to generate admission number
const generateAdmissionNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ADM${year}${random}`;
}; 