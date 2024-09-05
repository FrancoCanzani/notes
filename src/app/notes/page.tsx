import { auth } from '@clerk/nextjs/server';
import Sidebar from '@/components/sidebar/sidebar';
import fetchNotes from '@/lib/helpers/fetch-notes';
import NavDrawer from '@/components/nav-drawer';

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    const notes = await fetchNotes(userId);
    const serializedNotes = JSON.parse(JSON.stringify(notes));

    return (
      <div className='w-full sm:flex items-start'>
        <aside className='self-start sticky top-0 w-80 z-30 hidden h-[calc(100vh)] shrink-0 sm:sticky sm:block'>
          <Sidebar notes={serializedNotes} />
        </aside>
        <main className='flex-grow flex items-center justify-center h-screen bg-bermuda-gray-50'>
          <div className='text-center space-y-4 px-4'>
            <h2 className='text-3xl font-bold text-bermuda-gray-950'>
              Welcome to Your Notes!
            </h2>
            <p className='text-xl text-bermuda-gray-700'>
              Select a note to edit or create a new one to get started.
            </p>
            <NavDrawer notes={serializedNotes}>
              <button className='sm:hidden underline'>Open Menu</button>
            </NavDrawer>
          </div>
        </main>
      </div>
    );
  }
}
