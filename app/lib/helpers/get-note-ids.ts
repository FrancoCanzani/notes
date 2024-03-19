export default function getAllNoteIds() {
  const ids = [];
  for (let i = 0; i < localStorage.length; i++) {
    const id = localStorage.key(i);
    if (id && id.startsWith('note_')) {
      ids.push(id.substring(5));
    }
  }
  return ids;
}
