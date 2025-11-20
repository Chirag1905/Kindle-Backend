import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { join } from 'path';
import bookRoute from './routes/bookroutes.js';
import authRoute from './routes/authroutes.js';
import './config/index.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Get current directory for Bun (Bun provides import.meta.dir)
const __dirname = import.meta.dir;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Compression middleware
app.use(compression());

// Logging middleware (optimized for Bun)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  type: 'application/json'
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/v1/books', bookRoute);
app.use('/api/v1/auth', authRoute);

// Static file serving
app.use('/uploads', express.static(join(__dirname, 'uploads'), {
  maxAge: '1d',
  etag: true,
}));

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `The requested endpoint ${req.originalUrl} was not found on this server.`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    res.status(err.status || 500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong!',
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(err.status || 500).json({
      error: err.name || 'Internal Server Error',
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });
  }
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
};

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running with Bun in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 Listening on http://${HOST}:${PORT}`);
  console.log(`🏥 Health check available at http://${HOST}:${PORT}/health`);
  console.log(`⚡ Powered by Bun ${Bun.version}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;


