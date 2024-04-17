import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { updatePublishedStatus } from '../../lib/actions';
import { Note } from '../../lib/types';
import { useRouter } from 'next/navigation';

export default function PublishButton({ cloudNote }: { cloudNote?: Note }) {
  const session = useSession();
  const pathname = usePathname();
  const noteType = pathname.includes('cloud') ? 'cloud' : 'local';
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
    <>
      {noteType === 'cloud' && (
        <Button
          variant={'outline'}
          onClick={() => handleUpdatePublishedStatus()}
          className='hover:opacity-80 rounded-md shadow outline-none px-3 py-2'
          type='button'
        >
          {cloudNote?.published ? 'Withdraw' : 'Publish'}
        </Button>
      )}
    </>
  );
}
