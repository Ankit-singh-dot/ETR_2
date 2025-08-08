import { body, param, query, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Common validation rules
export const emailValidation = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email address');

export const passwordValidation = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');

export const phoneValidation = body('phone')
  .matches(/^\+?[\d\s\-\(\)]+$/)
  .withMessage('Please provide a valid phone number');

export const uuidValidation = param('id')
  .isUUID()
  .withMessage('Invalid ID format');

export const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

// Student validation
export const studentValidation = [
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  emailValidation,
  phoneValidation,
  body('dob').isISO8601().withMessage('Date of birth must be a valid date'),
  body('gender').isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Gender must be MALE, FEMALE, or OTHER'),
  body('admissionYear').isInt({ min: 2020, max: 2030 }).withMessage('Admission year must be between 2020 and 2030'),
  body('admissionStatus').isIn(['APPLIED', 'WAITING', 'REGISTERED', 'SELECTED', 'REJECTED']).withMessage('Invalid admission status'),
  body('programId').isUUID().withMessage('Invalid program ID')
];

// Program validation
export const programValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Program name must be between 2 and 100 characters'),
  body('programType').trim().isLength({ min: 2, max: 20 }).withMessage('Program type must be between 2 and 20 characters'),
  body('durationYears').isInt({ min: 1, max: 10 }).withMessage('Duration must be between 1 and 10 years'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
];

// Fee structure validation
export const feeStructureValidation = [
  body('totalFee').isFloat({ min: 0 }).withMessage('Total fee must be a positive number'),
  body('optionalScholarshipFee').optional().isFloat({ min: 0 }).withMessage('Scholarship fee must be a positive number'),
  body('scholarshipAmount').optional().isFloat({ min: 0 }).withMessage('Scholarship amount must be a positive number'),
  body('netFee').isFloat({ min: 0 }).withMessage('Net fee must be a positive number'),
  body('programId').isUUID().withMessage('Invalid program ID')
];

// Campus activity validation
export const campusActivityValidation = [
  body('eventName').trim().isLength({ min: 2, max: 100 }).withMessage('Event name must be between 2 and 100 characters'),
  body('eventType').trim().isLength({ min: 2, max: 50 }).withMessage('Event type must be between 2 and 50 characters'),
  body('startDate').isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').isISO8601().withMessage('End date must be a valid date'),
  body('organizedBy').trim().isLength({ min: 2, max: 100 }).withMessage('Organizer name must be between 2 and 100 characters'),
  body('department').optional().trim().isLength({ max: 50 }).withMessage('Department must be less than 50 characters')
];

// Placement record validation
export const placementRecordValidation = [
  body('placementYear').isInt({ min: 2020, max: 2030 }).withMessage('Placement year must be between 2020 and 2030'),
  body('totalStudents').isInt({ min: 0 }).withMessage('Total students must be a non-negative integer'),
  body('eligibleStudents').isInt({ min: 0 }).withMessage('Eligible students must be a non-negative integer'),
  body('studentsPlaced').isInt({ min: 0 }).withMessage('Students placed must be a non-negative integer'),
  body('highestPackage').isFloat({ min: 0 }).withMessage('Highest package must be a positive number'),
  body('averagePackage').isFloat({ min: 0 }).withMessage('Average package must be a positive number'),
  body('programId').isUUID().withMessage('Invalid program ID')
];

// Sales person validation
export const validateSalesPerson = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  emailValidation,
  phoneValidation,
  body('region').trim().isLength({ min: 2, max: 100 }).withMessage('Region must be between 2 and 100 characters'),
  body('assignedProgram').trim().isLength({ min: 1, max: 10 }).withMessage('Assigned program must be between 1 and 10 characters'),
  handleValidationErrors
];

// Student assignment validation
export const validateAssignStudent = [
  body('salesPersonId').isInt({ min: 1 }).withMessage('Sales person ID must be a valid integer'),
  body('studentId').isInt({ min: 1 }).withMessage('Student ID must be a valid integer'),
  handleValidationErrors
];

// Sub-admin validation
export const validateSubAdmin = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  emailValidation,
  phoneValidation,
  body('department').optional().trim().isLength({ max: 50 }).withMessage('Department must be less than 50 characters'),
  body('loginUser').optional().trim().isLength({ max: 50 }).withMessage('Login user must be less than 50 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// Collaboration validation
export const validateCollaboration = [
  body('industryName').trim().isLength({ min: 2, max: 100 }).withMessage('Industry name must be between 2 and 100 characters'),
  body('programId').isUUID().withMessage('Invalid program ID'),
  body('companyName').trim().isLength({ min: 2, max: 100 }).withMessage('Company name must be between 2 and 100 characters'),
  body('internshipMOU').optional().trim().isLength({ max: 100 }).withMessage('Internship MOU must be less than 100 characters'),
  body('type').optional().trim().isLength({ max: 50 }).withMessage('Type must be less than 50 characters'),
  body('yearOfSetup').optional().isInt({ min: 1900, max: 2030 }).withMessage('Year of setup must be between 1900 and 2030'),
  handleValidationErrors
];

// Program seat validation
export const validateProgramSeat = [
  body('totalSeats').isInt({ min: 1 }).withMessage('Total seats must be at least 1'),
  body('reservedSeats').isInt({ min: 0 }).withMessage('Reserved seats must be non-negative'),
  body('openSeats').isInt({ min: 0 }).withMessage('Open seats must be non-negative'),
  body('programId').isUUID().withMessage('Invalid program ID'),
  handleValidationErrors
];

// Eligibility criteria validation
export const validateEligibilityCriteria = [
  body('minQualification').trim().isLength({ min: 2, max: 100 }).withMessage('Minimum qualification must be between 2 and 100 characters'),
  body('minPercentage').isFloat({ min: 0, max: 100 }).withMessage('Minimum percentage must be between 0 and 100'),
  body('entranceExamName').trim().isLength({ min: 2, max: 100 }).withMessage('Entrance exam name must be between 2 and 100 characters'),
  body('programId').isUUID().withMessage('Invalid program ID'),
  handleValidationErrors
];

// Admission tracking validation
export const validateAdmissionTracking = [
  body('stage').isIn(['APPLIED', 'VERIFIED', 'APPROVED', 'REJECTED']).withMessage('Invalid document stage'),
  body('documentName').trim().isLength({ min: 2, max: 50 }).withMessage('Document name must be between 2 and 50 characters'),
  body('remarks').optional().trim().isLength({ max: 500 }).withMessage('Remarks must be less than 500 characters'),
  handleValidationErrors
]; 