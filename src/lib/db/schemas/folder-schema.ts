import mongoose from 'mongoose';
const { Schema } = mongoose;

const folderSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  parentFolderId: {
    type: String,
    ref: 'Folder',
    default: null,
  },
});

export const Folder =
  mongoose.models.Folder || mongoose.model('Folder', folderSchema);
