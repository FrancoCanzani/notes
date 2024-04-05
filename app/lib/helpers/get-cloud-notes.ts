import { Note } from '../db/schemas/note-schema';
import connectToDatabase from '../db/connect-to-db';

export default async function getCloudNotes(userId: string | undefined) {
  if (!userId) {
    return;
  }
  try {
    await connectToDatabase();
    const notes = await Note.find({ userId });
    // We need to parse this because only plain objects can be passed to Client Components from Server Components.
    const parsedNotes = JSON.parse(JSON.stringify(notes));
    return parsedNotes;
  } catch (error) {
    throw error;
  }
}
