import { Editor } from '@tiptap/core';

export default function WordCount({ editor }: { editor: Editor }) {
  return (
    <div className='fixed max-w-3xl bottom-2 pt-6 mx-auto px-3 text-xs text-gray-600'>
      <p className=''>
        {editor.storage.characterCount.characters()} characters /{' '}
        {editor.storage.characterCount.words()} words
      </p>
    </div>
  );
}
