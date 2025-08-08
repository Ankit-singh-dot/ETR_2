import express from 'express';
import { 
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  getProgramStats,
  createProgramSeat,
  updateProgramSeat,
  deleteProgramSeat,
  createEligibilityCriteria,
  updateEligibilityCriteria,
  deleteEligibilityCriteria
} from '../controllers/programController.js';
import { 
  programValidation, 
  uuidValidation, 
  paginationValidation,
  handleValidationErrors,
  validateProgramSeat,
  validateEligibilityCriteria
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
router.get('/', paginationValidation, handleValidationErrors, getAllPrograms);
router.get('/:id', uuidValidation, handleValidationErrors, getProgramById);
router.get('/:id/stats', uuidValidation, handleValidationErrors, getProgramStats);

// Admin/SubAdmin only routes
router.post('/', requireAdminOrSubAdmin, programValidation, handleValidationErrors, createProgram);
router.put('/:id', requireAdminOrSubAdmin, uuidValidation, programValidation, handleValidationErrors, updateProgram);
router.delete('/:id', requireAdmin, uuidValidation, handleValidationErrors, deleteProgram);

// Program Seat Management
router.post('/seats', requireAdminOrSubAdmin, validateProgramSeat, createProgramSeat);
router.put('/seats/:id', requireAdminOrSubAdmin, validateProgramSeat, updateProgramSeat);
router.delete('/seats/:id', requireAdmin, deleteProgramSeat);

// Eligibility Criteria Management
router.post('/eligibility', requireAdminOrSubAdmin, validateEligibilityCriteria, createEligibilityCriteria);
router.put('/eligibility/:id', requireAdminOrSubAdmin, validateEligibilityCriteria, updateEligibilityCriteria);
router.delete('/eligibility/:id', requireAdmin, deleteEligibilityCriteria);

export default router; 