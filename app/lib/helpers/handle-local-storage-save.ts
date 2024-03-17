export default async function handleLocalStorageSave(
  noteId: string,
  title: string,
  content: string
) {
  if (!noteId || !title || !content) {
    throw new Error('Note ID, title, and content must be provided');
  }
  const lastSaved = new Date().toLocaleString();

  const note = { title, lastSaved, content };
  await window.localStorage.setItem(`note_${noteId}`, JSON.stringify(note));
}
