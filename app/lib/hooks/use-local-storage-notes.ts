// why a useEffect? Using checks like typeof window !== 'undefined' in your rendering logic

import { useEffect, useState } from 'react';
import { Note } from '../types';

export default function useLocalStorageNotes(): {
  localNotes: Note[];
  setLocalNotes: React.Dispatch<React.SetStateAction<Note[]>>;
} {
  const [localNotes, setLocalNotes] = useState<Note[]>([]);

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
      setLocalNotes(localStorageNotes);
    } else {
      setLocalNotes([]);
    }
  }, []);

  return { localNotes, setLocalNotes };
}
