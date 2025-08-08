import prisma from '../config/db.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js';

export const createCampusActivity = async (req, res) => {
  try {
    const {
      eventName,
      eventType,
      startDate,
      endDate,
      organizedBy,
      department
    } = req.body;


    if (new Date(startDate) >= new Date(endDate)) {
      return errorResponse(res, 'End date must be after start date', 400);
    }

    const activity = await prisma.campusActivity.create({
      data: {
        eventName,
        eventType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        organizedBy,
        department
      }
    });

    return successResponse(res, activity, 'Campus activity created successfully', 201);
  } catch (error) {
    console.error('Create campus activity error:', error);
    return errorResponse(res, 'Failed to create campus activity', 500);
  }
};

export const getAllCampusActivities = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      eventType, 
      department,
      startDate,
      endDate,
      status 
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { eventName: { contains: search, mode: 'insensitive' } },
        { organizedBy: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (eventType) {
      where.eventType = eventType;
    }
    if (department) {
      where.department = department;
    }
    if (startDate && endDate) {
      where.AND = [
        { startDate: { gte: new Date(startDate) } },
        { endDate: { lte: new Date(endDate) } }
      ];
    }
    if (status) {
      const now = new Date();
      if (status === 'upcoming') {
        where.startDate = { gt: now };
      } else if (status === 'ongoing') {
        where.AND = [
          { startDate: { lte: now } },
          { endDate: { gte: now } }
        ];
      } else if (status === 'completed') {
        where.endDate = { lt: now };
      }
    }

    const [activities, total] = await Promise.all([
      prisma.campusActivity.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { startDate: 'asc' }
      }),
      prisma.campusActivity.count({ where })
    ]);

    // Add status to each activity
    const activitiesWithStatus = activities.map(activity => {
      const now = new Date();
      const startDate = new Date(activity.startDate);
      const endDate = new Date(activity.endDate);
      
      let status = 'upcoming';
      if (now >= startDate && now <= endDate) {
        status = 'ongoing';
      } else if (now > endDate) {
        status = 'completed';
      }

      return { ...activity, status };
    });

    return paginatedResponse(res, activitiesWithStatus, parseInt(page), parseInt(limit), total, 'Campus activities retrieved successfully');
  } catch (error) {
    console.error('Get campus activities error:', error);
    return errorResponse(res, 'Failed to get campus activities', 500);
  }
};

export const getCampusActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await prisma.campusActivity.findUnique({
      where: { id: parseInt(id) }
    });

    if (!activity) {
      return errorResponse(res, 'Campus activity not found', 404);
    }

    // Add status
    const now = new Date();
    const startDate = new Date(activity.startDate);
    const endDate = new Date(activity.endDate);
    
    let status = 'upcoming';
    if (now >= startDate && now <= endDate) {
      status = 'ongoing';
    } else if (now > endDate) {
      status = 'completed';
    }

    return successResponse(res, { ...activity, status }, 'Campus activity retrieved successfully');
  } catch (error) {
    console.error('Get campus activity error:', error);
    return errorResponse(res, 'Failed to get campus activity', 500);
  }
};

export const updateCampusActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      eventName,
      eventType,
      startDate,
      endDate,
      organizedBy,
      department
    } = req.body;


    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return errorResponse(res, 'End date must be after start date', 400);
    }

    const updateData = {};
    if (eventName) updateData.eventName = eventName;
    if (eventType) updateData.eventType = eventType;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (organizedBy) updateData.organizedBy = organizedBy;
    if (department !== undefined) updateData.department = department;

    const activity = await prisma.campusActivity.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return successResponse(res, activity, 'Campus activity updated successfully');
  } catch (error) {
    console.error('Update campus activity error:', error);
    return errorResponse(res, 'Failed to update campus activity', 500);
  }
};

export const deleteCampusActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await prisma.campusActivity.findUnique({
      where: { id: parseInt(id) }
    });

    if (!activity) {
      return errorResponse(res, 'Campus activity not found', 404);
    }

    await prisma.campusActivity.delete({
      where: { id: parseInt(id) }
    });

    return successResponse(res, null, 'Campus activity deleted successfully');
  } catch (error) {
    console.error('Delete campus activity error:', error);
    return errorResponse(res, 'Failed to delete campus activity', 500);
  }
};

export const getUpcomingActivities = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const now = new Date();

    const activities = await prisma.campusActivity.findMany({
      where: {
        startDate: { gt: now }
      },
      take: parseInt(limit),
      orderBy: { startDate: 'asc' }
    });

    return successResponse(res, activities, 'Upcoming activities retrieved successfully');
  } catch (error) {
    console.error('Get upcoming activities error:', error);
    return errorResponse(res, 'Failed to get upcoming activities', 500);
  }
};

export const getOngoingActivities = async (req, res) => {
  try {
    const now = new Date();

    const activities = await prisma.campusActivity.findMany({
      where: {
        AND: [
          { startDate: { lte: now } },
          { endDate: { gte: now } }
        ]
      },
      orderBy: { startDate: 'asc' }
    });

    return successResponse(res, activities, 'Ongoing activities retrieved successfully');
  } catch (error) {
    console.error('Get ongoing activities error:', error);
    return errorResponse(res, 'Failed to get ongoing activities', 500);
  }
};

export const getActivityStats = async (req, res) => {
  try {
    const now = new Date();

    const [totalActivities, upcomingActivities, ongoingActivities, completedActivities] = await Promise.all([
      prisma.campusActivity.count(),
      prisma.campusActivity.count({
        where: { startDate: { gt: now } }
      }),
      prisma.campusActivity.count({
        where: {
          AND: [
            { startDate: { lte: now } },
            { endDate: { gte: now } }
          ]
        }
      }),
      prisma.campusActivity.count({
        where: { endDate: { lt: now } }
      })
    ]);

    const eventTypeStats = await prisma.campusActivity.groupBy({
      by: ['eventType'],
      _count: {
        id: true
      }
    });

    const departmentStats = await prisma.campusActivity.groupBy({
      by: ['department'],
      _count: {
        id: true
      }
    });

    return successResponse(res, {
      totalActivities,
      upcomingActivities,
      ongoingActivities,
      completedActivities,
      eventTypeStats,
      departmentStats
    }, 'Activity statistics retrieved successfully');
  } catch (error) {
    console.error('Get activity stats error:', error);
    return errorResponse(res, 'Failed to get activity statistics', 500);
  }
}; 