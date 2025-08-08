import express from 'express';
import { 
  createSubAdmin,
  getAllSubAdmins,
  getSubAdminById,
  updateSubAdmin,
  deleteSubAdmin,
  getSubAdminStats,
  searchSubAdmins
} from '../controllers/subAdminController.js';
import { 
  paginationValidation,
  handleValidationErrors 
} from '../utils/validation.js';
import { 
  authenticate, 
  requireAdmin 
} from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Admin only routes
router.post('/', requireAdmin, handleValidationErrors, createSubAdmin);
router.get('/', paginationValidation, handleValidationErrors, getAllSubAdmins);
router.get('/stats', getSubAdminStats);
router.get('/search', searchSubAdmins);
router.get('/:id', handleValidationErrors, getSubAdminById);
router.put('/:id', requireAdmin, handleValidationErrors, updateSubAdmin);
router.delete('/:id', requireAdmin, handleValidationErrors, deleteSubAdmin);

export default router; 