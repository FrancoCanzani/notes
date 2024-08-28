import connectToDatabase from "../db/connect-to-db";
import { Note } from "../db/schemas/note-schema";

export async function fetchNote(userId: string | undefined, noteId: string) {
  if (!userId) {
    return null;
  }

  try {
    await connectToDatabase();

    const note = await Note.findOne({ userId: userId, id: noteId });
    return note;
  } catch (error) {
    throw error;
  }
}
