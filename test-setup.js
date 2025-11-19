// Test setup file for Bun
import { beforeAll, afterAll } from 'bun:test';

// Setup before all tests
beforeAll(async () => {
  console.log('🧪 Setting up test environment with Bun');
  
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
  process.env.DB_URI = 'mongodb://localhost:27017/kindle_test';
});

// Cleanup after all tests
afterAll(async () => {
  console.log('🧪 Cleaning up test environment');
  // Add cleanup logic here if needed
});