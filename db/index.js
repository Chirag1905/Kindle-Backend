import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) {
      console.log('📦 Database already connected');
      return;
    }

    // Skip database connection if no URI is provided or in test mode
    if (!process.env.DB_URI || process.env.NODE_ENV === 'test') {
      console.log('📦 Database connection skipped (no URI or test mode)');
      return;
    }

    try {
      // Log the DB_URI for debugging (do not log credentials in production)
      console.log('🔑 DB_URI:', process.env.DB_URI);

      const options = {
        // Modern MongoDB driver options
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
      };

      await mongoose.connect(process.env.DB_URI, options);
      
      this.isConnected = true;
      console.log('✅ Database connected successfully');
      console.log(`📊 Connected to: ${mongoose.connection.name}`);
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('⚠️  Continuing without database (development mode)');
      // Don't exit in development mode
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('📦 Database disconnected successfully');
    } catch (error) {
      console.error('❌ Database disconnection failed:', error.message);
    }
  }

  getConnectionState() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    
    return {
      state: states[mongoose.connection.readyState],
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      port: mongoose.connection.port,
    };
  }
}

// Create a singleton instance
const dbConnection = new DatabaseConnection();

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('📦 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await dbConnection.disconnect();
    console.log('📦 Database connection closed due to app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database disconnection:', error);
    process.exit(1);
  }
});

// Connect to database
await dbConnection.connect();

export default dbConnection;