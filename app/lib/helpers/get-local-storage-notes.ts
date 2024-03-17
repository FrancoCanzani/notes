export default function getLocalStorageNotes(): {
  key: string;
  title: string;
  content: string;
  lastSaved: string;
}[] {
  const notes: {
    key: string;
    title: string;
    content: string;
    lastSaved: string;
  }[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('note_')) {
      const item = localStorage.getItem(key);
      if (item) {
        const { title, content, lastSaved } = JSON.parse(item);
        notes.push({ key: key.substring(5), title, content, lastSaved });
      }
    }
  }

  return notes;
}
