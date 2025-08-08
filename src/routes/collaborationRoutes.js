import express from 'express';
import { 
  createCollaboration,
  getAllCollaborations,
  getCollaborationById,
  updateCollaboration,
  deleteCollaboration,
  getCollaborationsByProgram,
  getCollaborationStats,
  searchCollaborations
} from '../controllers/collaborationController.js';
import { 
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
router.get('/', paginationValidation, handleValidationErrors, getAllCollaborations);
router.get('/stats', getCollaborationStats);
router.get('/search', searchCollaborations);
router.get('/program/:programId', getCollaborationsByProgram);
router.get('/:id', handleValidationErrors, getCollaborationById);

// Admin/SubAdmin only routes
router.post('/', requireAdminOrSubAdmin, handleValidationErrors, createCollaboration);
router.put('/:id', requireAdminOrSubAdmin, handleValidationErrors, updateCollaboration);
router.delete('/:id', requireAdmin, handleValidationErrors, deleteCollaboration);

export default router; 