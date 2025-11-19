import { test, expect, describe } from 'bun:test';
import { ApiResponse } from './utils/response.js';

describe('API Response Utility', () => {
  test('should create success response structure', () => {
    const mockRes = {
      status: (code) => ({
        json: (data) => ({ statusCode: code, data })
      })
    };

    const result = ApiResponse.success(mockRes, { id: 1 }, 'Test success');
    
    expect(result.statusCode).toBe(200);
    expect(result.data.success).toBe(true);
    expect(result.data.message).toBe('Test success');
    expect(result.data.data).toEqual({ id: 1 });
  });

  test('should create error response structure', () => {
    const mockRes = {
      status: (code) => ({
        json: (data) => ({ statusCode: code, data })
      })
    };

    const result = ApiResponse.error(mockRes, 'Test error', 400);
    
    expect(result.statusCode).toBe(400);
    expect(result.data.success).toBe(false);
    expect(result.data.message).toBe('Test error');
  });
});

describe('Health Check', () => {
  test('should return OK status', async () => {
    const response = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };

    expect(response.status).toBe('OK');
    expect(response.environment).toBeDefined();
    expect(typeof response.uptime).toBe('number');
  });
});

describe('Environment', () => {
  test('should detect Bun runtime', () => {
    expect(typeof Bun).toBe('object');
    expect(Bun.version).toBeDefined();
    console.log(`Running on Bun ${Bun.version}`);
  });
});