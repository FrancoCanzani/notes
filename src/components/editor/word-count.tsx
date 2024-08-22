import { Editor } from "@tiptap/core";

export default function WordCount({ editor }: { editor: Editor }) {
  return (
    <p className="max-w-3xl pt-6 mx-auto px-3 text-xs text-gray-600">
      {editor.storage.characterCount.characters()} characters /{" "}
      {editor.storage.characterCount.words()} words
    </p>
  );
}
