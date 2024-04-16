import connectToDatabase from '../db/connect-to-db';
import { Note } from '../db/schemas/note-schema';
import { Note as NoteType } from '../types';

export async function getPublishedNote(noteId: string) {
  try {
    await connectToDatabase();

    const note: NoteType | null = await Note.findOne({ id: noteId });

    if (note && note.published) {
      // We need to parse this because only plain objects can be passed to Client Components from Server Components.
      const parsedNote = JSON.parse(JSON.stringify(note));
      return parsedNote;
    }
  } catch (error) {
    throw error;
  }
}
