'use client';

import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

export function NavigatorShareButton({
  publicationUrl,
  className,
}: {
  publicationUrl: string;
  className?: string;
}) {
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(publicationUrl)
      .then(() => toast.success(`Copied ${publicationUrl}`))
      .catch((err) => toast.error('Failed to copy:', err));
  };

  return (
    <button type='button' className={cn(className)} onClick={copyToClipboard}>
      <Copy size={13} /> Copy Publication URL
    </button>
  );
}
