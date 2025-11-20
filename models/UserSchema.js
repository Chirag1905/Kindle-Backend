import mongoose from 'mongoose';

import formatDate from "./formatDate";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: formatDate },
});

const UserSchema = mongoose.models.User || mongoose.model('User', userSchema);

export default UserSchema;

