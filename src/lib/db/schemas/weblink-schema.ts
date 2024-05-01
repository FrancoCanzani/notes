import mongoose from 'mongoose';
const { Schema } = mongoose;

const weblinkSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  created: {
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
  label: {
    text: String,
    color: String,
  },
});

export const Weblink =
  mongoose.models.Weblink || mongoose.model('Weblink', weblinkSchema);
