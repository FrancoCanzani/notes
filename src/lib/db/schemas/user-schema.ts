import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  unifiedId: {
    type: String,
    required: true,
    unique: true,
  },
  linkedProviders: [String],
  image: {
    type: String,
  },
  creation: {
    type: Date,
    default: Date.now(),
  },
  lastSaved: {
    type: Date,
    default: Date.now(),
  },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
