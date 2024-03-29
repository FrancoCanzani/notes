import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Button } from './ui/button';
import { ReactNode } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { buttonVariants } from './ui/button';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  tooltipText: string;
  onClickAction: () => void;
}

export default function MenuBarItem({
  className,
  children,
  tooltipText,
  variant,
  size,
  onClickAction,
  ...props
}: ButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant={'menu'}
            size={'sm'}
            onClick={onClickAction}
            className={cn(buttonVariants({ className }))}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
