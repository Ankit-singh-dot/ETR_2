import express from 'express';
import { 
  login, 
  register, 
  getProfile, 
  updateProfile 
} from '../controllers/authController.js';
import { 
  emailValidation, 
  passwordValidation, 
  handleValidationErrors 
} from '../utils/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// public_routes
router.post('/login', [
  emailValidation,
  passwordValidation,
  handleValidationErrors
], login);

router.post('/register', [
  emailValidation,
  passwordValidation,
  handleValidationErrors
], register);

// protected_routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router; 