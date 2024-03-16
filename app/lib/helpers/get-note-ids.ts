export default function getAllNoteIds() {
  if (typeof window !== 'undefined') {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('note_')) {
        keys.push(key.substring(5));
      }
    }
    return keys;
  }
}
