import { Editor } from "@tiptap/core";

export default function WordCount({ editor }: { editor: Editor }) {
  return (
    <footer className="fixed bottom-0 right-0 left-80 bg-bermuda-gray-50 border-t">
      <div className="px-2.5 py-1.5 text-xs text-gray-600 flex items-center justify-between">
        <p>Notesz Inc.</p>
        <p>
          {editor.storage.characterCount.characters()} characters /{" "}
          {editor.storage.characterCount.words()} words
        </p>
      </div>
    </footer>
  );
}
