import connectToDatabase from '../db/connect-to-db';
import { Note } from '../db/schemas/note-schema';

export async function getCloudNote(userId: string | undefined, noteId: string) {
  if (!userId) {
    throw new Error('Missing user id for getCloudNote');
  }

  try {
    await connectToDatabase();

    const note = await Note.findOne({ userId, id: noteId });
    return note;
  } catch (error) {
    throw error;
  }
}
