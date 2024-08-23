import mongoose from "mongoose";
const { Schema } = mongoose;

const folderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  parentFolderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null, // For supporting nested folders in the future
  },
});

export const Folder =
  mongoose.models.Folder || mongoose.model("Folder", folderSchema);
