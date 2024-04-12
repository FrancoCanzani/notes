import { Editor } from '@tiptap/core';
import { BubbleMenu as Bubble } from '@tiptap/react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import {
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from '@radix-ui/react-icons';

export default function BubbleMenu({ editor }: { editor: Editor }) {
  return (
    <>
      {editor && (
        <Bubble
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className='flex h-10 items-center space-x-1 rounded-md border text-xs bg-white p-1'
        >
          <Button
            variant={'menu'}
            size={'sm'}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={
              editor.isActive('bold') ? 'font-bold bg-gray-50 shadow' : ''
            }
            aria-label='bold'
            title='Bold'
          >
            <FontBoldIcon />
          </Button>
          <Button
            variant={'menu'}
            size={'sm'}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={
              editor.isActive('italic') ? 'font-bold bg-gray-50 shadow' : ''
            }
            aria-label='italic'
            title='Italic'
          >
            <FontItalicIcon />
          </Button>
          <Button
            variant={'menu'}
            size={'sm'}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={
              editor.isActive('underline') ? 'font-bold bg-gray-50 shadow' : ''
            }
            aria-label='underline'
            title='Underline'
          >
            <UnderlineIcon />
          </Button>
          <Button
            variant={'menu'}
            size={'sm'}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={
              editor.isActive('strike') ? 'font-bold bg-gray-50 shadow' : ''
            }
            aria-label='strike'
            title='Strike'
          >
            <StrikethroughIcon />
          </Button>
          <Button
            variant={'menu'}
            size={'sm'}
            onClick={() =>
              editor.isActive('highlight')
                ? editor.chain().focus().unsetHighlight().run()
                : editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: '#FFD465' })
                    .run()
            }
            disabled={!editor.can().chain().focus().toggleHighlight().run()}
            className={cn(
              'bg-[#FFD465]/50 hover:bg-[#FFD465]',
              editor.isActive('highlight')
                ? 'font-bold bg-[#FFD465] shadow'
                : ''
            )}
            aria-label='highlight'
            title='Highlight'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='1em'
              height='1em'
              viewBox='0 0 32 32'
            >
              <path
                fill='currentColor'
                d='m23.625 3.063l-.719.624L7.563 17l-.5.469l.25.656s1.125 3-1.032 5.156v.032l-.031.03l-.156.188l-.125.125L2 27.531L7.375 29l2.063-2.063l.218-.187l.031-.031h.032c2.156-2.157 5.156-1.032 5.156-1.032l.656.25l.469-.5l13.313-15.343l.625-.719zm-.125 2.75L27.188 9.5l-8.75 10.063l-5-5zM11.937 15.874l5.188 5.188l-1.938 2.25l-5.5-5.5zM9.563 20.5l2.937 2.938c-1.242.046-2.746.437-4.156 1.812c-.02.02-.043.012-.063.031l-.25.219l-.531-.531l.219-.25l.031-.063c1.375-1.41 1.766-2.914 1.813-4.156'
              />
            </svg>{' '}
          </Button>
        </Bubble>
      )}
    </>
  );
}
