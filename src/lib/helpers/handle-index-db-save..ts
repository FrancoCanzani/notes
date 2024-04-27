import { Note } from '../types';
import { get, set } from 'idb-keyval';

export default async function handleIndexedDBSave(
  noteId: string,
  title: string,
  content: string
) {
  if (!noteId || !title || !content) {
    throw new Error('Note ID, title, and content must be provided');
  }

  try {
    const oldNote = await get(noteId);

    if (oldNote) {
      const updatedNote: Note = {
        ...oldNote,
        title,
        content,
        lastSaved: new Date(),
      };
      await set(noteId, updatedNote);
    } else {
      const newNote: Note = {
        id: noteId,
        title,
        content,
        pinned: false,
        lastSaved: new Date(),
        type: 'local',
        status: 'active',
      };
      await set(noteId, newNote);
    }
  } catch (error) {
    throw new Error(`Error saving note:}`);
  }
}
