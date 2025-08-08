import prisma from '../config/db.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js';
import { hashPassword } from '../utils/auth.js';

export const createSubAdmin = async (req, res) => {
  try {
    const {
      name,
      phone,
      department
    } = req.body;

    const subAdmin = await prisma.subAdmin.create({
      data: {
        name,
        phone,
        department
      },
      include: {
        userLogin: true
      }
    });

    return successResponse(res, subAdmin, 'Sub-admin created successfully', 201);
  } catch (error) {
    console.error('Create sub-admin error:', error);
    return errorResponse(res, 'Failed to create sub-admin', 500);
  }
};

export const getAllSubAdmins = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      department 
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (department) {
      where.department = department;
    }

    const [subAdmins, total] = await Promise.all([
      prisma.subAdmin.findMany({
        where,
        include: {
          userLogin: true
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.subAdmin.count({ where })
    ]);

    return paginatedResponse(res, subAdmins, parseInt(page), parseInt(limit), total, 'Sub-admins retrieved successfully');
  } catch (error) {
    console.error('Get sub-admins error:', error);
    return errorResponse(res, 'Failed to get sub-admins', 500);
  }
};

export const getSubAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const subAdmin = await prisma.subAdmin.findUnique({
      where: { id: parseInt(id) },
      include: {
        userLogin: true
      }
    });

    if (!subAdmin) {
      return errorResponse(res, 'Sub-admin not found', 404);
    }

    return successResponse(res, subAdmin, 'Sub-admin retrieved successfully');
  } catch (error) {
    console.error('Get sub-admin error:', error);
    return errorResponse(res, 'Failed to get sub-admin', 500);
  }
};

export const updateSubAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      phone,
      department
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (department !== undefined) updateData.department = department;

    const subAdmin = await prisma.subAdmin.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        userLogin: true
      }
    });

    return successResponse(res, subAdmin, 'Sub-admin updated successfully');
  } catch (error) {
    console.error('Update sub-admin error:', error);
    return errorResponse(res, 'Failed to update sub-admin', 500);
  }
};

export const deleteSubAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const subAdmin = await prisma.subAdmin.findUnique({
      where: { id: parseInt(id) }
    });

    if (!subAdmin) {
      return errorResponse(res, 'Sub-admin not found', 404);
    }

    await prisma.subAdmin.delete({
      where: { id: parseInt(id) }
    });

    return successResponse(res, null, 'Sub-admin deleted successfully');
  } catch (error) {
    console.error('Delete sub-admin error:', error);
    return errorResponse(res, 'Failed to delete sub-admin', 500);
  }
};

export const getSubAdminStats = async (req, res) => {
  try {
    const [totalSubAdmins, departmentStats] = await Promise.all([
      prisma.subAdmin.count(),
      prisma.subAdmin.groupBy({
        by: ['department'],
        _count: {
          id: true
        }
      })
    ]);

    const recentSubAdmins = await prisma.subAdmin.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        createdAt: true
      }
    });

    return successResponse(res, {
      totalSubAdmins,
      departmentStats,
      recentSubAdmins
    }, 'Sub-admin statistics retrieved successfully');
  } catch (error) {
    console.error('Get sub-admin stats error:', error);
    return errorResponse(res, 'Failed to get sub-admin statistics', 500);
  }
};

export const searchSubAdmins = async (req, res) => {
  try {
    const { query, department } = req.query;

    const where = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } }
      ];
    }
    if (department) {
      where.department = department;
    }

    const subAdmins = await prisma.subAdmin.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        department: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(res, subAdmins, 'Sub-admins search completed successfully');
  } catch (error) {
    console.error('Search sub-admins error:', error);
    return errorResponse(res, 'Failed to search sub-admins', 500);
  }
}; 