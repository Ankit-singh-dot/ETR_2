import express from 'express';
import { 
  createCampusActivity,
  getAllCampusActivities,
  getCampusActivityById,
  updateCampusActivity,
  deleteCampusActivity,
  getUpcomingActivities,
  getOngoingActivities,
  getActivityStats
} from '../controllers/campusActivityController.js';
import { 
  campusActivityValidation, 
  paginationValidation,
  handleValidationErrors 
} from '../utils/validation.js';
import { 
  authenticate, 
  requireAdminOrSubAdmin,
  requireAdmin 
} from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Public routes (authenticated users can view)
router.get('/', paginationValidation, handleValidationErrors, getAllCampusActivities);
router.get('/upcoming', getUpcomingActivities);
router.get('/ongoing', getOngoingActivities);
router.get('/stats', getActivityStats);
router.get('/:id', handleValidationErrors, getCampusActivityById);

// Admin/SubAdmin only routes
router.post('/', requireAdminOrSubAdmin, campusActivityValidation, handleValidationErrors, createCampusActivity);
router.put('/:id', requireAdminOrSubAdmin, campusActivityValidation, handleValidationErrors, updateCampusActivity);
router.delete('/:id', requireAdmin, handleValidationErrors, deleteCampusActivity);

export default router; 