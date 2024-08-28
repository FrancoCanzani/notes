import connectToDatabase from "../db/connect-to-db";
import { Note } from "../db/schemas/note-schema";

class DatabaseConnectionError extends Error {
  code: string;

  constructor(message: string) {
    super(message);
    this.code = "DATABASE_CONNECTION_ERROR";
  }
}

export default async function fetchNotes(userId?: string) {
  try {
    await connectToDatabase();

    if (!userId) {
      const allNotes = await Note.find({});
      return allNotes;
    } else {
      const userNotes = await Note.find({ userId: userId });

      if (!userNotes || userNotes.length === 0) {
        return [];
      }

      return userNotes;
    }
  } catch (error: unknown) {
    if (error instanceof DatabaseConnectionError) {
      throw new Error("Unable to connect to the database");
    } else {
      throw new Error("Error retrieving notes: " + (error as Error).message);
    }
  }
}
