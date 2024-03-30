import { Note } from '../types';

export default function handleLocalStorageSave(
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
  window.localStorage.setItem(`note_${noteId}`, JSON.stringify(note));
}
