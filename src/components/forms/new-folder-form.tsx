import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { FolderSimple } from '@phosphor-icons/react';
import { createFolder } from '../../lib/actions';
import { useRouter, usePathname } from 'next/navigation';

export default function NewFolderForm() {
  const [folderName, setFolderName] = useState('');
  const { userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const noteId = pathname.split('/').pop();

  async function handleSubmit() {
    if (userId && folderName.trim()) {
      toast.promise(createFolder(folderName.trim(), userId), {
        loading: 'Creating folder...',
        success: () => {
          router.push(`/notes/${noteId}`);
          setFolderName('');
          return 'Folder created successfully';
        },
        error: 'Error creating folder',
      });
    } else if (!folderName.trim()) {
      toast.error('Please enter a folder name');
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className='flex hover:bg-bermuda-gray-100 bg-bermuda-gray-50 p-1 items-center justify-start gap-x-1.5 truncate cursor-pointer'
    >
      <FolderSimple size={16} />
      <div className='flex items-center justify-center w-max flex-1 gap-x-1'>
        <input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          type='text'
          className='border-none w-full focus-visible:ring-0 focus-visible:ring-offset-0 outline-none bg-transparent'
          placeholder='Folder title'
          required
          autoFocus
        />
        <button
          className='rounded-sm px-2 text-xs py-1 bg-bermuda-gray-950 text-white hover:bg-bermuda-gray-900'
          type='submit'
        >
          Add
        </button>
      </div>
    </form>
  );
}
