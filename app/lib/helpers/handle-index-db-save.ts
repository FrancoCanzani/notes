import { Note } from '../types';
import { set } from 'idb-keyval';

export default async function handleIndexedDBSave(
  noteId: string,
  title: string,
  content: string
) {
  if (!noteId || !title || !content) {
    throw new Error('Note ID, title, and content must be provided');
  }
  const lastSaved = new Date();

  const note: Note = {
    id: noteId,
    title,
    content,
    pinned: false,
    lastSaved,
    type: 'local',
  };

  try {
    await set(noteId, note);
  } catch (error) {
    throw error;
  }
}
