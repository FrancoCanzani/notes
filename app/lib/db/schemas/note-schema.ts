import mongoose from 'mongoose';
const { Schema } = mongoose;

const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'cloud',
  },
  created: {
    type: String,
    default: Date.now(),
  },
  lastSaved: {
    type: String,
    default: Date.now(),
  },
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  pinned: {
    type: Boolean,
    default: false,
  },
});

export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
