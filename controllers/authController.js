// controllers/authController.js
import { ApiResponse } from '../utils/response.js';
import { generateToken, hashPassword, comparePassword } from '../utils/auth.js';
import { UserSchema } from '../models/index.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists (by email or username)
        const existingUser = await UserSchema.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return ApiResponse.error(res, 'Email already registered', 409);
            }
            if (existingUser.username === username) {
                return ApiResponse.error(res, 'Username already taken', 409);
            }
        }
        // Hash password and create user
        const hashedPassword = await hashPassword(password);
        const newUser = new UserSchema({
            username,
            email,
            password: hashedPassword,
            role: 'user',
        });
        await newUser.save();
        // Generate token
        const token = await generateToken({
            id: newUser._id,
            email: newUser.email,
            role: newUser.role
        });
        // Remove password from response
        const userObj = newUser.toObject();
        delete userObj.password;
        const userResponse = userObj;
        ApiResponse.created(res, {
            user: userResponse,
            token
        }, 'User registered successfully');
    } catch (error) {
        console.error('Registration error:', error);
        ApiResponse.error(res, 'Registration failed', 500, error?.message || error);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserSchema.findOne({ email });
        if (!user) {
            return ApiResponse.unauthorized(res, 'Invalid email or password');
        }
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return ApiResponse.unauthorized(res, 'Invalid email or password');
        }
        const token = await generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        });
        const userObj = user.toObject();
        delete userObj.password;
        const userResponse = userObj;
        ApiResponse.success(res, {
            user: userResponse,
            token
        }, 'Login successful');
    } catch (error) {
        ApiResponse.error(res, 'Login failed', 500, error?.message || error);
    }
};
