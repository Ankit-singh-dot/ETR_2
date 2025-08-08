import express from 'express';
import { 
  createSalesPerson,
  getAllSalesPersons,
  getSalesPersonById,
  updateSalesPerson,
  deleteSalesPerson,
  assignStudentToSalesPerson,
  unassignStudentFromSalesPerson,
  getSalesPersonStats,
  getSalesPersonsByRegion
} from '../controllers/salesPersonController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateSalesPerson, validateAssignStudent } from '../utils/validation.js';

const router = express.Router();

// Public routes (for testing - in production, these should be protected)
router.get('/', getAllSalesPersons);
router.get('/region/:region', getSalesPersonsByRegion);
router.get('/:id', getSalesPersonById);
router.get('/:id/stats', getSalesPersonStats);

// Protected routes - only admins and sub-admins can manage sales persons
router.use(authenticate);
router.use(authorize(['ADMIN', 'SUBADMIN']));

router.post('/', validateSalesPerson, createSalesPerson);
router.put('/:id', validateSalesPerson, updateSalesPerson);
router.delete('/:id', deleteSalesPerson);

// Student assignment routes
router.post('/assign-student', validateAssignStudent, assignStudentToSalesPerson);
router.patch('/unassign-student/:studentId', unassignStudentFromSalesPerson);

export default router;
