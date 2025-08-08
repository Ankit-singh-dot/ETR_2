import express from 'express';
import { 
  createFeeStructure,
  getAllFeeStructures,
  getFeeStructureById,
  updateFeeStructure,
  deleteFeeStructure,
  getFeeStructureByProgram,
  calculateScholarship
} from '../controllers/feeController.js';
import { 
  feeStructureValidation, 
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
router.get('/', paginationValidation, handleValidationErrors, getAllFeeStructures);
router.get('/:id', handleValidationErrors, getFeeStructureById);
router.get('/program/:programId', handleValidationErrors, getFeeStructureByProgram);
router.post('/calculate-scholarship', handleValidationErrors, calculateScholarship);

// Admin/SubAdmin only routes
router.post('/', requireAdminOrSubAdmin, feeStructureValidation, handleValidationErrors, createFeeStructure);
router.put('/:id', requireAdminOrSubAdmin, feeStructureValidation, handleValidationErrors, updateFeeStructure);
router.delete('/:id', requireAdmin, handleValidationErrors, deleteFeeStructure);

export default router; 