import { toast } from 'sonner';
import { updatePublishedStatus } from '../../lib/actions';
import { Note } from '../../lib/types';
import { useRouter } from 'next/navigation';
import { cn } from '../../lib/utils';
import { BookCheck, BookDashed } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

export default function PublishButton({
  cloudNote,
  className,
}: {
  cloudNote: Note;
  className?: string;
}) {
  const router = useRouter();
  const { userId } = useAuth();

  const handleUpdatePublishedStatus = async () => {
    if (cloudNote && userId) {
      try {
        await updatePublishedStatus(userId, cloudNote.id);
        router.refresh();
        toast.success(
          cloudNote.published
            ? `Withdrawn note ${cloudNote.title}`
            : `Published note ${cloudNote.title}`
        );
      } catch (error) {
        toast.error(`Failed to change status: ${cloudNote.title}`);
      }
    }
  };

  return (
    <button
      onClick={() => handleUpdatePublishedStatus()}
      className={cn(className)}
      type='button'
    >
      {cloudNote?.published ? (
        <BookDashed size={13} />
      ) : (
        <BookCheck size={13} />
      )}{' '}
      {cloudNote?.published ? 'Withdraw Note' : 'Publish Note'}
    </button>
  );
}
