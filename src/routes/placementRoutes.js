import express from 'express';
import { 
  createPlacementRecord,
  getAllPlacementRecords,
  getPlacementRecordById,
  updatePlacementRecord,
  deletePlacementRecord,
  getPlacementStats,
  getTopPerformingPrograms
} from '../controllers/placementController.js';
import { 
  placementRecordValidation, 
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
router.get('/', paginationValidation, handleValidationErrors, getAllPlacementRecords);
router.get('/stats', getPlacementStats);
router.get('/top-performing', getTopPerformingPrograms);
router.get('/:id', handleValidationErrors, getPlacementRecordById);

// Admin/SubAdmin only routes
router.post('/', requireAdminOrSubAdmin, placementRecordValidation, handleValidationErrors, createPlacementRecord);
router.put('/:id', requireAdminOrSubAdmin, placementRecordValidation, handleValidationErrors, updatePlacementRecord);
router.delete('/:id', requireAdmin, handleValidationErrors, deletePlacementRecord);

export default router; 