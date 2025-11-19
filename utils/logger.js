import { config } from '../config/index.js';

/**
 * Simple, structured logging utility
 */
class Logger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
    this.currentLevel = this.levels[config.logging.level] || this.levels.info;
  }

  /**
   * Format log message
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const baseLog = {
      timestamp,
      level: level.toUpperCase(),
      message,
      pid: process.pid,
      environment: config.server.nodeEnv,
    };

    if (Object.keys(meta).length > 0) {
      baseLog.meta = meta;
    }

    return baseLog;
  }

  /**
   * Log message if level is enabled
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  log(level, message, meta = {}) {
    if (this.levels[level] <= this.currentLevel) {
      const formattedMessage = this.formatMessage(level, message, meta);
      
      if (config.server.nodeEnv === 'production') {
        // In production, output JSON for log aggregation systems
        console.log(JSON.stringify(formattedMessage));
      } else {
        // In development, output human-readable format
        const { timestamp, level: logLevel, message: msg, ...rest } = formattedMessage;
        const emoji = this.getEmoji(level);
        console.log(`${emoji} [${timestamp}] ${logLevel}: ${msg}`);
        
        if (Object.keys(rest).length > 0) {
          console.log('  ', rest);
        }
      }
    }
  }

  /**
   * Get emoji for log level
   * @param {string} level - Log level
   */
  getEmoji(level) {
    const emojis = {
      error: '❌',
      warn: '⚠️',
      info: 'ℹ️',
      debug: '🔍',
    };
    return emojis[level] || 'ℹ️';
  }

  /**
   * Log error message
   * @param {string} message - Error message
   * @param {Object} meta - Additional metadata
   */
  error(message, meta = {}) {
    this.log('error', message, meta);
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {Object} meta - Additional metadata
   */
  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  /**
   * Log info message
   * @param {string} message - Info message
   * @param {Object} meta - Additional metadata
   */
  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  /**
   * Log debug message
   * @param {string} message - Debug message
   * @param {Object} meta - Additional metadata
   */
  debug(message, meta = {}) {
    this.log('debug', message, meta);
  }

  /**
   * Log HTTP request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {number} duration - Request duration in ms
   */
  logRequest(req, res, duration) {
    const meta = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
    };

    if (req.user?.id) {
      meta.userId = req.user.id;
    }

    const level = res.statusCode >= 400 ? 'warn' : 'info';
    this.log(level, `${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`, meta);
  }
}

// Create and export singleton logger instance
const logger = new Logger();

export default logger;