import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { createFolder } from '../../lib/actions';
import { FolderSimple } from '@phosphor-icons/react';

export default function NewFolderForm() {
  const [folderName, setFolderName] = useState('');
  const { userId } = useAuth();

  return (
    <form
      className='flex mb-1 hover:bg-bermuda-gray-100 bg-bermuda-gray-50 p-1 items-center justify-start gap-x-1.5 truncate cursor-pointer'
      onSubmit={async (e) => {
        e.preventDefault();
        if (userId && folderName.trim()) {
          try {
            await createFolder(folderName.trim(), userId);
            setFolderName('');
          } catch (error) {
            toast.error('Error creating folder');
          }
        }
      }}
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
