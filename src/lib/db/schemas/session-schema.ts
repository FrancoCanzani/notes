import mongoose from 'mongoose';
const { Schema } = mongoose;

const sessionSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const Session =
  mongoose.models.Session || mongoose.model('Session', sessionSchema);
