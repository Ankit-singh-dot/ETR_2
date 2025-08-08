import express from 'express';
import { 
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  updateAdmissionStatus,
  addAdmissionTracking,
  getStudentStats
} from '../controllers/studentController.js';
import { 
  studentValidation, 
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
router.get('/', paginationValidation, handleValidationErrors, getAllStudents);
router.get('/stats', getStudentStats);
router.get('/:id', handleValidationErrors, getStudentById);

// Admin/SubAdmin only routes
router.post('/', requireAdminOrSubAdmin, studentValidation, handleValidationErrors, createStudent);
router.put('/:id', requireAdminOrSubAdmin, handleValidationErrors, updateStudent);
router.delete('/:id', requireAdmin, handleValidationErrors, deleteStudent);

// Admission management routes
router.patch('/:id/admission-status', requireAdminOrSubAdmin, handleValidationErrors, updateAdmissionStatus);
router.post('/:id/tracking', requireAdminOrSubAdmin, handleValidationErrors, addAdmissionTracking);

export default router; 