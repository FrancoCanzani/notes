import { ReactNode } from 'react';
import Sidebar from '../../../components/sidebar';

export default function NotesLayout({ children }: { children: ReactNode }) {
  return (
    <div className='w-full md:flex items-start'>
      <aside className='self-start sticky top-0 w-72 z-30 hidden h-[calc(100vh)] shrink-0 md:sticky md:block'>
        <Sidebar />
      </aside>
      <main className='flex-1 relative overflow-y-auto'>{children}</main>
    </div>
  );
}
