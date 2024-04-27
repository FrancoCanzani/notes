import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { updatePublishedStatus } from '../../lib/actions';
import { Note } from '../../lib/types';
import { useRouter } from 'next/navigation';
import { cn } from '../../lib/utils';
import { BookCheck, MoreHorizontal, BookDashed } from 'lucide-react';

export default function PublishButton({
  cloudNote,
  className,
}: {
  cloudNote: Note;
  className?: string;
}) {
  const session = useSession();
  const router = useRouter();

  const handleUpdatePublishedStatus = async () => {
    if (cloudNote) {
      try {
        await updatePublishedStatus(session.data?.user.id, cloudNote.id);
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
