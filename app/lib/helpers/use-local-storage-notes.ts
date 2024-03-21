// why a useEffect? Using checks like typeof window !== 'undefined' in your rendering logic

import { Note } from '../types';
import { useEffect, useState } from 'react';

export default function useLocalStorageNotes(): Note[] {
  const [notes, setNotes] = useState<Note[]>([]); // State to store notes

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const localStorageNotes: Note[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const id = localStorage.key(i);
        if (id && id.startsWith('note_')) {
          const item = localStorage.getItem(id);
          if (item) {
            const { title, content, lastSaved, pinned, created, type } =
              JSON.parse(item);
            localStorageNotes.push({
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
      setNotes(localStorageNotes);
    } else {
      setNotes([]);
    }
  }, []);

  return notes;
}
