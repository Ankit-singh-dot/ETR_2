import prisma from '../config/db.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js';

export const createSalesPerson = async (req, res) => {
  try {
    const { name, email, phone, region, assignedProgram } = req.body;

    // Check if sales person with email already exists
    const existingSalesPerson = await prisma.salesPerson.findUnique({
      where: { email }
    });

    if (existingSalesPerson) {
      return errorResponse(res, 'Sales person with this email already exists', 409);
    }

    const salesPerson = await prisma.salesPerson.create({
      data: {
        name,
        email,
        phone,
        region,
        assignedProgram
      }
    });

    return successResponse(res, salesPerson, 'Sales person created successfully', 201);
  } catch (error) {
    console.error('Create sales person error:', error);
    return errorResponse(res, 'Failed to create sales person', 500);
  }
};

export const getAllSalesPersons = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, region, assignedProgram } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { region: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (region) {
      where.region = { contains: region, mode: 'insensitive' };
    }
    if (assignedProgram) {
      where.assignedProgram = assignedProgram;
    }

    const [salesPersons, total] = await Promise.all([
      prisma.salesPerson.findMany({
        where,
        include: {
          students: {
            select: {
              id: true,
              fullName: true,
              email: true,
              admissionStatus: true,
              admissionYear: true
            }
          },
          _count: {
            select: {
              students: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.salesPerson.count({ where })
    ]);

    return paginatedResponse(res, salesPersons, parseInt(page), parseInt(limit), total, 'Sales persons retrieved successfully');
  } catch (error) {
    console.error('Get sales persons error:', error);
    return errorResponse(res, 'Failed to get sales persons', 500);
  }
};

export const getSalesPersonById = async (req, res) => {
  try {
    const { id } = req.params;

    const salesPerson = await prisma.salesPerson.findUnique({
      where: { id: parseInt(id) },
      include: {
        students: {
          include: {
            program: {
              select: {
                id: true,
                name: true,
                programType: true
              }
            },
            admissionTracking: {
              orderBy: { updatedAt: 'desc' },
              take: 5
            }
          }
        },
        _count: {
          select: {
            students: true
          }
        }
      }
    });

    if (!salesPerson) {
      return errorResponse(res, 'Sales person not found', 404);
    }

    return successResponse(res, salesPerson, 'Sales person retrieved successfully');
  } catch (error) {
    console.error('Get sales person error:', error);
    return errorResponse(res, 'Failed to get sales person', 500);
  }
};

export const updateSalesPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, region, assignedProgram } = req.body;

    // Check if another sales person with the same email exists
    if (email) {
      const existingSalesPerson = await prisma.salesPerson.findFirst({
        where: {
          email,
          id: { not: parseInt(id) }
        }
      });

      if (existingSalesPerson) {
        return errorResponse(res, 'Another sales person with this email already exists', 409);
      }
    }

    const salesPerson = await prisma.salesPerson.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        region,
        assignedProgram
      },
      include: {
        students: {
          select: {
            id: true,
            fullName: true,
            admissionStatus: true
          }
        }
      }
    });

    return successResponse(res, salesPerson, 'Sales person updated successfully');
  } catch (error) {
    console.error('Update sales person error:', error);
    return errorResponse(res, 'Failed to update sales person', 500);
  }
};

export const deleteSalesPerson = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if sales person has assigned students
    const salesPersonWithStudents = await prisma.salesPerson.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            students: true
          }
        }
      }
    });

    if (!salesPersonWithStudents) {
      return errorResponse(res, 'Sales person not found', 404);
    }

    if (salesPersonWithStudents._count.students > 0) {
      return errorResponse(res, 'Cannot delete sales person with assigned students. Please reassign students first.', 400);
    }

    await prisma.salesPerson.delete({
      where: { id: parseInt(id) }
    });

    return successResponse(res, null, 'Sales person deleted successfully');
  } catch (error) {
    console.error('Delete sales person error:', error);
    return errorResponse(res, 'Failed to delete sales person', 500);
  }
};

export const assignStudentToSalesPerson = async (req, res) => {
  try {
    const { salesPersonId, studentId } = req.body;

    // Verify both sales person and student exist
    const [salesPerson, student] = await Promise.all([
      prisma.salesPerson.findUnique({
        where: { id: parseInt(salesPersonId) }
      }),
      prisma.student.findUnique({
        where: { id: parseInt(studentId) }
      })
    ]);

    if (!salesPerson) {
      return errorResponse(res, 'Sales person not found', 404);
    }

    if (!student) {
      return errorResponse(res, 'Student not found', 404);
    }

    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(studentId) },
      data: { salesId: parseInt(salesPersonId) },
      include: {
        salesPerson: true,
        program: {
          select: {
            id: true,
            name: true,
            programType: true
          }
        }
      }
    });

    return successResponse(res, updatedStudent, 'Student assigned to sales person successfully');
  } catch (error) {
    console.error('Assign student error:', error);
    return errorResponse(res, 'Failed to assign student to sales person', 500);
  }
};

export const unassignStudentFromSalesPerson = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) }
    });

    if (!student) {
      return errorResponse(res, 'Student not found', 404);
    }

    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(studentId) },
      data: { salesId: null },
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

    return successResponse(res, updatedStudent, 'Student unassigned from sales person successfully');
  } catch (error) {
    console.error('Unassign student error:', error);
    return errorResponse(res, 'Failed to unassign student from sales person', 500);
  }
};

export const getSalesPersonStats = async (req, res) => {
  try {
    const { id } = req.params;

    const salesPerson = await prisma.salesPerson.findUnique({
      where: { id: parseInt(id) },
      include: {
        students: {
          select: {
            admissionStatus: true,
            admissionYear: true,
            program: {
              select: {
                programType: true
              }
            }
          }
        }
      }
    });

    if (!salesPerson) {
      return errorResponse(res, 'Sales person not found', 404);
    }

    // Calculate statistics
    const totalStudents = salesPerson.students.length;
    const admissionStatusCounts = salesPerson.students.reduce((acc, student) => {
      acc[student.admissionStatus] = (acc[student.admissionStatus] || 0) + 1;
      return acc;
    }, {});

    const yearWiseStats = salesPerson.students.reduce((acc, student) => {
      acc[student.admissionYear] = (acc[student.admissionYear] || 0) + 1;
      return acc;
    }, {});

    const programTypeStats = salesPerson.students.reduce((acc, student) => {
      const type = student.program.programType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const stats = {
      salesPerson: {
        id: salesPerson.id,
        name: salesPerson.name,
        email: salesPerson.email,
        region: salesPerson.region,
        assignedProgram: salesPerson.assignedProgram
      },
      totalStudents,
      admissionStatusCounts,
      yearWiseStats,
      programTypeStats,
      conversionRate: totalStudents > 0 ? (
        ((admissionStatusCounts.REGISTERED || 0) + (admissionStatusCounts.SELECTED || 0)) / totalStudents * 100
      ).toFixed(2) : 0
    };

    return successResponse(res, stats, 'Sales person statistics retrieved successfully');
  } catch (error) {
    console.error('Get sales person stats error:', error);
    return errorResponse(res, 'Failed to get sales person statistics', 500);
  }
};

export const getSalesPersonsByRegion = async (req, res) => {
  try {
    const { region } = req.params;

    const salesPersons = await prisma.salesPerson.findMany({
      where: {
        region: {
          contains: region,
          mode: 'insensitive'
        }
      },
      include: {
        _count: {
          select: {
            students: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return successResponse(res, salesPersons, `Sales persons in ${region} retrieved successfully`);
  } catch (error) {
    console.error('Get sales persons by region error:', error);
    return errorResponse(res, 'Failed to get sales persons by region', 500);
  }
};
