export default function getAllNoteIds() {
  if (!window) {
    return;
  }
  const keys = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith('note_')) {
      keys.push(key.substring(5));
    }
  }
  return keys;
}
