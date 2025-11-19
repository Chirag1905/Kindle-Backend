import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { promisify } from 'util';

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @param {string} secret - JWT secret
 * @param {string} expiresIn - Token expiration time
 * @returns {Promise<string>} JWT token
 */
export const generateToken = async (payload, secret = process.env.JWT_SECRET, expiresIn = '7d') => {
  const signAsync = promisify(jwt.sign);
  return await signAsync(payload, secret, { expiresIn });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @param {string} secret - JWT secret
 * @returns {Promise<Object>} Decoded token payload
 */
export const verifyToken = async (token, secret = process.env.JWT_SECRET) => {
  const verifyAsync = promisify(jwt.verify);
  return await verifyAsync(token, secret);
};

/**
 * Hash password
 * @param {string} password - Plain text password
 * @param {number} saltRounds - Number of salt rounds
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password, saltRounds = 12) => {
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} Password match result
 */
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate refresh token
 * @param {Object} payload - Token payload
 * @returns {Promise<string>} Refresh token
 */
export const generateRefreshToken = async (payload) => {
  return await generateToken(
    payload,
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRE || '30d'
  );
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {Promise<Object>} Decoded token payload
 */
export const verifyRefreshToken = async (token) => {
  return await verifyToken(token, process.env.JWT_REFRESH_SECRET);
};