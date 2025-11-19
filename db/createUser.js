import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model('User', userSchema);

async function createUser() {
  try {
    await mongoose.connect(process.env.DB_URI);
    const existing = await User.findOne({ username: 'testuser' });
    if (existing) {
      console.log('User already exists:', existing.username);
    } else {
      const user = new User({
        username: 'testuser',
        password: 'testpassword',
        email: 'testuser@example.com',
      });
      await user.save();
      console.log('User created:', user.username);
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error creating user:', err.message);
  }
}

createUser();
