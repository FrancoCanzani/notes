export default function handleLocalStorageSave(
  noteId: string,
  title: string,
  content: string
) {
  if (typeof window !== 'undefined') {
    if (!noteId || !title || !content) {
      throw new Error('Note ID, title, and content must be provided');
    }
    const lastSaved = new Date().toLocaleString();

    const note = { title, lastSaved, content };
    window.localStorage.setItem(`note_${noteId}`, JSON.stringify(note));
  } else {
    throw new Error('Local Storage API is only available in client components');
  }
}
