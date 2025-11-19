import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Configuration object with environment variables and defaults
 */
export const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT, 10) || 5000,
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Database Configuration
  database: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017/kindle_db',
    name: process.env.DB_NAME || 'kindle_db',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      bufferCommands: false,
      bufferMaxEntries: 0,
    },
  },

  // CORS Configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['https://yourdomain.com'])
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10MB
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    allowedMimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/epub+zip',
      'application/x-mobipocket-ebook',
    ],
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  // Security Configuration
  security: {
    bcryptSaltRounds: 12,
    sessionSecret: process.env.SESSION_SECRET || 'fallback-session-secret',
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

/**
 * Validate required environment variables
 */
export const validateConfig = () => {
  const requiredVars = [];
  
  if (config.server.nodeEnv === 'production') {
    requiredVars.push(
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'DB_URI'
    );
  }

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please set these variables in your .env file or environment.'
    );
  }
};

/**
 * Get configuration for specific environment
 * @param {string} env - Environment name
 */
export const getEnvConfig = (env = config.server.nodeEnv) => {
  const envConfigs = {
    development: {
      ...config,
      logging: { level: 'debug' },
    },
    test: {
      ...config,
      database: {
        ...config.database,
        uri: process.env.TEST_DB_URI || 'mongodb://localhost:27017/kindle_test',
      },
      logging: { level: 'error' },
    },
    production: {
      ...config,
      logging: { level: 'warn' },
    },
  };

  return envConfigs[env] || config;
};

// Validate configuration on import
if (config.server.nodeEnv === 'production') {
  try {
    validateConfig();
  } catch (error) {
    console.error('❌ Configuration validation failed:', error.message);
    process.exit(1);
  }
}

export default config;