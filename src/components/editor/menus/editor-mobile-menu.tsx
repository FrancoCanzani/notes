import React from 'react';
import { Editor } from '@tiptap/core';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';
import BubbleMenuAiActions from './bubble-menu/bubble-menu-ai-actions';
import BubbleMenuJustifyOptions from './bubble-menu/bubble-menu-justify-options';
import BubbleMenuLink from './bubble-menu/bubble-menu-link';
import {
  TextB,
  TextAUnderline,
  TextItalic,
  TextStrikethrough,
  MagicWand,
  HighlighterCircle,
  Image,
  ArrowUUpLeft,
  ArrowUUpRight,
} from '@phosphor-icons/react';
import { Separator } from '../../ui/separator';

export default function EditorMobileMenu({ editor }: { editor: Editor }) {
  return (
    <TooltipProvider>
      <nav className='sm:hidden border-y border-bermuda-gray-950/30 text-sm pl-1.5'>
        <div className='flex items-center justify-evenly overflow-x-scroll no-scrollbar gap-x-1.5 px-2'>
          <BubbleMenuAiActions editor={editor} className='border-none' />
          <Separator
            orientation='vertical'
            className='bg-bermuda-gray-950 opacity-30 h-6 p-[0.3px]'
          />
          <BarButton
            icon={<MagicWand size={19} />}
            tooltip='Insert AI Writer'
            onClick={() => editor.chain().focus().setAiWriter().run()}
          />
          <Separator
            orientation='vertical'
            className='bg-bermuda-gray-950 opacity-30 h-6 p-[0.3px]'
          />{' '}
          <BarButton
            icon={<Image size={19} />}
            tooltip='Insert image'
            onClick={() => {
              /* Add image insertion logic */
            }}
          />
          <Separator
            orientation='vertical'
            className='bg-bermuda-gray-950 opacity-30 h-6 p-[0.3px]'
          />
          <BarButton
            icon={<TextB size={19} />}
            tooltip='Bold'
            isActive={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          />
          <Separator
            orientation='vertical'
            className='bg-bermuda-gray-950 opacity-30 h-6 p-[0.3px]'
          />
          <BarButton
            icon={<TextItalic size={19} />}
            tooltip='Italic'
            isActive={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          />
          <Separator
            orientation='vertical'
            className='bg-bermuda-gray-950 opacity-30 h-6 p-[0.3px]'
          />
          <BarButton
            icon={<TextAUnderline size={19} />}
            tooltip='Underline'
            isActive={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
          />
          <Separator
            orientation='vertical'
            className='bg-bermuda-gray-950 opacity-30 h-6 p-[0.3px]'
          />
          <BarButton
            icon={<TextStrikethrough size={19} />}
            tooltip='Strike'
            isActive={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
          />
          <Separator
            orientation='vertical'
            className='bg-bermuda-gray-950 opacity-30 h-6 p-[0.3px]'
          />
          <BubbleMenuLink editor={editor} className={cn('border-none')} />
          <Separator
            orientation='vertical'
            className='bg-bermuda-gray-950 opacity-30 h-6 p-[0.3px]'
          />
          <BubbleMenuJustifyOptions
            editor={editor}
            className={cn('border-none')}
          />
          <Separator
            orientation='vertical'
            className='bg-bermuda-gray-950 opacity-30 h-6 p-[0.3px]'
          />
          <BarButton
            icon={<HighlighterCircle size={19} />}
            tooltip='Highlight'
            isActive={editor.isActive('highlight')}
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
          />
          <Separator
            orientation='vertical'
            className='bg-bermuda-gray-950 opacity-30 h-6 p-[0.3px]'
          />
          <BarButton
            icon={<ArrowUUpRight size={19} />}
            tooltip='Redo'
            isActive={editor.isActive('strike')}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          />
          <BarButton
            icon={<ArrowUUpLeft size={19} />}
            tooltip='Undo'
            isActive={editor.isActive('strike')}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          />
        </div>
      </nav>
    </TooltipProvider>
  );
}

function BarButton({
  icon,
  tooltip,
  onClick,
  isActive,
  disabled,
}: {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='menu'
          size='sm'
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'border-none',
            isActive && 'bg-bermuda-gray-50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
