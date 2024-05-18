import connectToDatabase from '../db/connect-to-db';
import { Note } from '../db/schemas/note-schema';

class DatabaseConnectionError extends Error {
  code: string;

  constructor(message: string) {
    super(message);
    this.code = 'DATABASE_CONNECTION_ERROR';
  }
}

export default async function getCloudNotes(userId: string | undefined) {
  try {
    if (!userId) {
      return null;
    }

    await connectToDatabase();
    const notes = await Note.find({ userId: userId });

    if (!notes) {
      throw new Error('No notes found for the user');
    }

    return notes;
  } catch (error: unknown) {
    if (error instanceof DatabaseConnectionError) {
      throw new Error('Unable to connect to the database');
    } else {
      throw new Error('Error retrieving notes: ' + (error as Error).message);
    }
  }
}
