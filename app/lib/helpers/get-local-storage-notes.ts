import { Note } from '../types';

export default function getLocalStorageNotes(): Note[] {
  const notes: Note[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const id = localStorage.key(i);
    if (id && id.startsWith('note_')) {
      const item = localStorage.getItem(id);
      if (item) {
        const { title, content, lastSaved, pinned, created, type } =
          JSON.parse(item);
        notes.push({
          id: id.substring(5),
          title,
          content,
          lastSaved,
          created,
          pinned,
          type,
        });
      }
    }
  }

  return notes;
}
