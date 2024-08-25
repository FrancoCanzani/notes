import mongoose from 'mongoose';
const { Schema } = mongoose;

const noteSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  type: {
    type: String,
    default: 'cloud',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  lastSaved: {
    type: Date,
    default: Date.now,
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
  published: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active',
  },
  label: {
    text: String,
    color: String,
  },
});

export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
