import { Router } from 'express';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/error.js';
import { register, login } from '../controllers/authController.js';

const router = Router();

// POST /api/v1/auth/register - User registration
router.post('/register',
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
        body('username')
            .trim()
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long'),
    ],
    handleValidationErrors,
        register
);

// POST /api/v1/auth/login - User login
router.post('/login',
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
        body('password')
            .notEmpty()
            .withMessage('Password is required'),
    ],
    handleValidationErrors,
        login
);

export default router;