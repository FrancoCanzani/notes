import { Note } from '../db/schemas/note-schema';
import connectToDatabase from '../db/connect-to-db';

export default async function getCloudNotes(userId: string | undefined) {
  if (!userId) {
    throw new Error('Missing user id for getCloudNote');
  }

  try {
    await connectToDatabase();
    const notes = await Note.find({ userId });
    return notes;
  } catch (error) {
    throw error;
  }
}
