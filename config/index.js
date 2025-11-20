import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log('📦 Database already connected');
    return;
  }
  if (!process.env.DB_URI || process.env.NODE_ENV === 'test') {
    console.log('📦 Database connection skipped (no URI or test mode)');
    return;
  }
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔑 DB_URI:', process.env.DB_URI);
    }
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };
    await mongoose.connect(process.env.DB_URI, options);
    isConnected = true;
    console.log('✅ Database connected successfully');
    console.log(`📊 Connected to: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('⚠️  Continuing without database (development mode)');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

async function disconnectDB() {
  if (!isConnected) return;
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('📦 Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error.message);
  }
}

function getConnectionState() {
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
    await disconnectDB();
    console.log('📦 Database connection closed due to app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database disconnection:', error);
    process.exit(1);
  }
});

// Connect to database (top-level await compatibility)
(async () => {
  await connectDB();
})();

export { connectDB, disconnectDB, getConnectionState };