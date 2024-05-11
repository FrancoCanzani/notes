'use client';

import 'regenerator-runtime/runtime';

import { useEffect, useRef } from 'react';
import { Editor } from '@tiptap/core';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { cn } from '../../lib/utils';

export default function SpeechToText({ editor }: { editor: Editor }) {
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    finalTranscript,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const prev = useRef('');

  // Insert chunks of the generated text
  useEffect(() => {
    const diff = transcript.slice(prev.current.length);
    prev.current = transcript;
    editor?.commands.insertContent(diff);
  }, [transcript, editor]);

  return (
    <div className='flex'>
      {listening ? (
        <button
          className={cn(
            'opacity-75 hover:opacity-100',
            listening && 'animate-pulse'
          )}
          onClick={() => SpeechRecognition.stopListening()}
          title='Stop speech recognition'
          aria-label='Stop speech recognition'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='2rem'
            width='2rem'
            viewBox='0 -960 960 960'
            fill='black'
          >
            <path d='M680-560q-33 0-56.5-23T600-640v-160q0-34 23.5-57t56.5-23q34 0 57 23t23 57v160q0 34-23 57t-57 23ZM200-80q-33 0-56.5-23.5T120-160v-640q0-33 23.5-56.5T200-880h320v80H200v640h440v-80h80v80q0 33-23.5 56.5T640-80H200Zm80-160v-80h280v80H280Zm0-120v-80h200v80H280Zm440 40h-80v-104q-77-14-128.5-74.5T460-640h80q0 58 41 99t99 41q59 0 99.5-41t40.5-99h80q0 81-51 141.5T720-424v104Z' />
          </svg>{' '}
        </button>
      ) : (
        <button
          className='opacity-75 hover:opacity-100'
          onClick={() => SpeechRecognition.startListening()}
          title='Speech recognition'
          aria-label='Speech recognition'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='1.2rem'
            width='1.2rem'
            viewBox='0 -960 960 960'
            fill='black'
          >
            <path d='M680-560q-33 0-56.5-23T600-640v-160q0-34 23.5-57t56.5-23q34 0 57 23t23 57v160q0 34-23 57t-57 23ZM200-80q-33 0-56.5-23.5T120-160v-640q0-33 23.5-56.5T200-880h320v80H200v640h440v-80h80v80q0 33-23.5 56.5T640-80H200Zm80-160v-80h280v80H280Zm0-120v-80h200v80H280Zm440 40h-80v-104q-77-14-128.5-74.5T460-640h80q0 58 41 99t99 41q59 0 99.5-41t40.5-99h80q0 81-51 141.5T720-424v104Z' />
          </svg>{' '}
        </button>
      )}
    </div>
  );
}
