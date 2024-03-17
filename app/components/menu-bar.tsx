'use client';

import { Editor } from '@tiptap/core';
import {
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  CodeIcon,
  EraserIcon,
  TextIcon,
  ListBulletIcon,
  DividerHorizontalIcon,
  QuoteIcon,
  UnderlineIcon,
} from '@radix-ui/react-icons';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

export default function MenuBar({
  editor,
  isSaved,
}: {
  editor: Editor | null;
  isSaved: boolean;
}) {
  if (!editor) {
    return null;
  }

  return (
    <div className='flex items-center no-scrollbar shadow justify-start space-x-3 overflow-x-auto py-1 px-2 rounded-sm'>
      <span
        className={cn(
          'hover:bg-gray-50 border-gray-100 p-1 border',
          !isSaved && 'animate-pulse'
        )}
      >
        {isSaved ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1.2em'
            height='1.2em'
            viewBox='0 0 24 24'
          >
            <path
              fill='currentColor'
              d='M18.5 20a.5.5 0 0 1-.5.5h-5v1c0 .171-.017.338-.05.5H18a2 2 0 0 0 2-2V9.828a2 2 0 0 0-.586-1.414l-5.829-5.828a.491.491 0 0 0-.049-.04a.63.63 0 0 1-.036-.03a2.072 2.072 0 0 0-.219-.18a.652.652 0 0 0-.08-.044l-.048-.024l-.05-.029c-.054-.031-.109-.063-.166-.087a1.977 1.977 0 0 0-.624-.138a.56.56 0 0 1-.059-.007a.605.605 0 0 0-.082-.007H6a2 2 0 0 0-2 2v7h1.5V4a.5.5 0 0 1 .5-.5h6V8a2 2 0 0 0 2 2h4.5zm-5-15.379L17.378 8.5H14a.5.5 0 0 1-.5-.5zM5 12h3v2H5zm-2.5 0H4v2.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5V12h.379a1.5 1.5 0 0 1 1.06.44l1.122 1.12A1.5 1.5 0 0 1 12 14.622V21.5a1.5 1.5 0 0 1-1.5 1.5H10v-5.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0-.5.5V23h-.5A1.5 1.5 0 0 1 1 21.5v-8A1.5 1.5 0 0 1 2.5 12M9 18v5H4v-5z'
            />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1.2em'
            height='1.2em'
            viewBox='0 0 24 24'
          >
            <path
              fill='currentColor'
              d='M18.5 20a.5.5 0 0 1-.5.5h-5.732A6.518 6.518 0 0 1 11.19 22H18a2 2 0 0 0 2-2V9.828a2 2 0 0 0-.586-1.414l-5.829-5.828a.491.491 0 0 0-.049-.04a.63.63 0 0 1-.036-.03a2.072 2.072 0 0 0-.219-.18a.652.652 0 0 0-.08-.044l-.048-.024l-.05-.029c-.054-.031-.109-.063-.166-.087a1.977 1.977 0 0 0-.624-.138a.56.56 0 0 1-.059-.007a.605.605 0 0 0-.082-.007H6a2 2 0 0 0-2 2v7.498a6.451 6.451 0 0 1 1.5-.422V4a.5.5 0 0 1 .5-.5h6V8a2 2 0 0 0 2 2h4.5zm-5-15.379L17.378 8.5H14a.5.5 0 0 1-.5-.5zM1 17.5a5.5 5.5 0 1 0 11 0a5.5 5.5 0 0 0-11 0M9.5 14a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h1a2.496 2.496 0 0 0-2-1c-.833 0-1.572.407-2.027 1.036a.5.5 0 1 1-.81-.586A3.496 3.496 0 0 1 6.5 14c.98 0 1.865.403 2.5 1.05v-.55a.5.5 0 0 1 .5-.5M4 19.95v.55a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-1c.456.608 1.183 1 2 1c.766 0 1.452-.344 1.911-.888a.5.5 0 0 1 .764.645A3.493 3.493 0 0 1 6.5 21A3.49 3.49 0 0 1 4 19.95'
            />
          </svg>
        )}
      </span>
      <Button
        variant={'menu'}
        size={'sm'}
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={
          editor.isActive('paragraph') ? 'font-bold bg-gray-50 shadow' : ''
        }
        aria-label='paragraph'
      >
        <TextIcon />
      </Button>
      <Button
        variant={'menu'}
        size={'sm'}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'font-bold bg-gray-50 shadow' : ''}
        aria-label='font bold'
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
        aria-label='font italic'
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
        aria-label='strike through'
      >
        <StrikethroughIcon />
      </Button>
      <Button
        variant={'menu'}
        size={'sm'}
        onClick={() =>
          editor.chain().focus().toggleHighlight({ color: '#FFD465' }).run()
        }
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={cn(
          'bg-[#FFD465]/50 hover:bg-[#FFD465]',
          editor.isActive('highlight') ? 'font-bold bg-[#FFD465] shadow' : ''
        )}
        aria-label='code'
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

      <Button
        variant={'menu'}
        size={'sm'}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={
          editor.isActive('codeBlock') ? 'font-bold bg-gray-50 shadow' : ''
        }
        aria-label='code'
      >
        <CodeIcon />
      </Button>
      <Button
        variant={'menu'}
        size={'sm'}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          editor.isActive('blockquote') ? 'font-bold bg-gray-50 shadow' : ''
        }
        aria-label='blockquote'
      >
        <QuoteIcon />
      </Button>
      <Button
        variant={'menu'}
        size={'sm'}
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        aria-label='clear marks'
      >
        <EraserIcon />
      </Button>

      <Button
        variant={'menu'}
        size={'sm'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(
          'font-serif text-[14px]',
          editor.isActive('heading', { level: 1 })
            ? 'font-bold bg-gray-50 shadow'
            : ''
        )}
      >
        H1
      </Button>
      <Button
        variant={'menu'}
        size={'sm'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          'font-serif text-[14px]',
          editor.isActive('heading', { level: 2 })
            ? 'font-bold bg-gray-50 shadow'
            : ''
        )}
      >
        H2
      </Button>
      <Button
        variant={'menu'}
        size={'sm'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(
          'font-serif text-[14px]',
          editor.isActive('heading', { level: 3 })
            ? 'font-bold bg-gray-50 shadow'
            : ''
        )}
      >
        H3
      </Button>
      <Button
        variant={'menu'}
        size={'sm'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive('bulletList') ? 'font-bold bg-gray-50 shadow' : ''
        }
        aria-label='bullet list'
      >
        <ListBulletIcon />
      </Button>
      <Button
        variant={'menu'}
        size={'sm'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive('orderedList') ? 'font-bold bg-gray-50 shadow' : ''
        }
        aria-label='ordered list'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='1em'
          height='1em'
          viewBox='0 0 16 16'
        >
          <path
            fill='currentColor'
            fillRule='evenodd'
            d='M2.287 2.326L2.692 2h.677v3h-.708V2.792l-.374.281zM5 3h10v1H5zm0 4h10v1H5zm10 4H5v1h10zM3.742 7.626l.029-.039l.065-.09a.84.84 0 0 0 .156-.507c0-.12-.02-.24-.057-.354a.848.848 0 0 0-.492-.529a1.123 1.123 0 0 0-.452-.082a1.094 1.094 0 0 0-.458.087a.867.867 0 0 0-.479.522A1.038 1.038 0 0 0 2 6.957v.05h.81v-.05a.3.3 0 0 1 .046-.157a.174.174 0 0 1 .057-.054a.19.19 0 0 1 .172 0a.188.188 0 0 1 .056.06a.24.24 0 0 1 .031.081a.445.445 0 0 1-.036.29a1.309 1.309 0 0 1-.12.182l-1 1.138l-.012.013v.54h1.988v-.7h-.9zm-.037 3.817c.046.032.086.07.12.114a.841.841 0 0 1 .167.55c0 .107-.017.213-.05.314a.792.792 0 0 1-.487.5a1.288 1.288 0 0 1-.48.079c-.115 0-.23-.016-.341-.049a.94.94 0 0 1-.258-.123a.751.751 0 0 1-.182-.177a1.063 1.063 0 0 1-.116-.2A1.038 1.038 0 0 1 2 12.078v-.049h.814v.049c0 .027.003.055.009.082a.207.207 0 0 0 .03.074a.14.14 0 0 0 .053.052a.2.2 0 0 0 .157.008a.159.159 0 0 0 .056-.039a.22.22 0 0 0 .042-.075a.417.417 0 0 0 .017-.126a.483.483 0 0 0-.022-.163a.2.2 0 0 0-.051-.08a.138.138 0 0 0-.06-.029a.537.537 0 0 0-.077-.007h-.161v-.645h.168a.241.241 0 0 0 .069-.011a.164.164 0 0 0 .065-.034a.175.175 0 0 0 .048-.067a.286.286 0 0 0 .021-.121a.28.28 0 0 0-.016-.1a.166.166 0 0 0-.097-.099a.2.2 0 0 0-.156.007a.164.164 0 0 0-.055.053a.344.344 0 0 0-.04.156v.049H2v-.049a.987.987 0 0 1 .18-.544a.8.8 0 0 1 .179-.186a.87.87 0 0 1 .262-.133c.114-.036.234-.053.354-.051c.116-.001.231.01.344.036c.092.021.18.055.263.1a.757.757 0 0 1 .32.318a.73.73 0 0 1 .09.347a.81.81 0 0 1-.167.528a.562.562 0 0 1-.12.114'
            clipRule='evenodd'
          />
        </svg>{' '}
      </Button>

      <Button
        variant={'menu'}
        size={'sm'}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        aria-label='horizontal rule'
      >
        <DividerHorizontalIcon />
      </Button>
      <Button
        variant={'menu'}
        size={'sm'}
        onClick={() => editor.chain().focus().setHardBreak().run()}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='1em'
          height='1em'
          viewBox='0 0 1024 1024'
        >
          <path
            fill='currentColor'
            d='M864 170h-60c-4.4 0-8 3.6-8 8v518H310v-73c0-6.7-7.8-10.5-13-6.3l-141.9 112a8 8 0 0 0 0 12.6l141.9 112c5.3 4.2 13 .4 13-6.3v-75h498c35.3 0 64-28.7 64-64V178c0-4.4-3.6-8-8-8'
          />
        </svg>{' '}
      </Button>
      <Button
        variant={'menu'}
        size={'sm'}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        aria-label='undo'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='1em'
          height='1em'
          viewBox='0 0 24 24'
        >
          <g
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeWidth='2'
          >
            <path d='M4 9h12a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5H7' />
            <path strokeLinejoin='round' d='M7 5L3 9l4 4' />
          </g>
        </svg>
      </Button>
      <Button
        variant={'menu'}
        size={'sm'}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        aria-label='redo'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='1em'
          height='1em'
          viewBox='0 0 24 24'
        >
          <path
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M21 9H8a5 5 0 0 0 0 10h9m4-10l-4-4m4 4l-4 4'
          />
        </svg>
      </Button>
    </div>
  );
}
