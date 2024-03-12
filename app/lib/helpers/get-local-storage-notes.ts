export default function getLocalStorageNotes(): {
  title: string;
  content: string;
  lastSaved: string;
}[] {
  const notes: { title: string; content: string; lastSaved: string }[] = [];
  if (typeof window !== 'undefined') {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('note_')) {
        const item = localStorage.getItem(key);
        if (item) {
          const { title, content, lastSaved } = JSON.parse(item);
          notes.push({ title, content, lastSaved });
        }
      }
    }
  }
  return notes;
}
