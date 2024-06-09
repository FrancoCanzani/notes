import mongoose from 'mongoose';

const { Schema } = mongoose;

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
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
  completed: {
    type: Boolean,
    default: false,
  },
});

export const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);
