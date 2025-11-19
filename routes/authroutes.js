import { Router } from 'express';
import { body } from 'express-validator';
import { ApiResponse } from '../utils/response.js';
import { handleValidationErrors } from '../middleware/error.js';
import { generateToken, hashPassword, comparePassword } from '../utils/auth.js';

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
    body('name')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password, name } = req.body;

      // Mock user creation (replace with actual database logic)
      const hashedPassword = await hashPassword(password);
      const user = {
        id: Date.now(),
        email,
        name,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      // Generate token
      const token = await generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Remove password from response
      const { password: _, ...userResponse } = user;

      ApiResponse.created(res, {
        user: userResponse,
        token
      }, 'User registered successfully');
    } catch (error) {
      ApiResponse.error(res, 'Registration failed', 500);
    }
  }
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
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Mock user lookup (replace with actual database logic)
      const mockUser = {
        id: 1,
        email: 'user@example.com',
        name: 'Test User',
        password: await hashPassword('password123'), // Pre-hashed for demo
        role: 'user'
      };

      // Check if user exists and password is correct
      if (email !== mockUser.email) {
        return ApiResponse.unauthorized(res, 'Invalid email or password');
      }

      const isValidPassword = await comparePassword(password, mockUser.password);
      if (!isValidPassword) {
        return ApiResponse.unauthorized(res, 'Invalid email or password');
      }

      // Generate token
      const token = await generateToken({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      });

      // Remove password from response
      const { password: _, ...userResponse } = mockUser;

      ApiResponse.success(res, {
        user: userResponse,
        token
      }, 'Login successful');
    } catch (error) {
      ApiResponse.error(res, 'Login failed', 500);
    }
  }
);

export default router;