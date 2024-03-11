export default function handleLocalStorageSave(
  noteId: string,
  content: string
) {
  if (typeof window !== 'undefined') {
    if (!noteId || !content) {
      throw new Error('Note ID and content must be provided');
    }

    const prefixedNoteId = `note_${noteId}`;
    window.localStorage.setItem(prefixedNoteId, content);
  } else {
    throw new Error('Local Storage API is only available in client components');
  }
}
