import NavDrawer from '../../components/nav-drawer';
import { auth } from '@clerk/nextjs/server';
import getCloudNotes from '../../lib/helpers/get-cloud-notes';
import { Note, Todo } from '../../lib/types';
import Todos from '../../components/todos';
import getTodos from '../../lib/helpers/get-todos';

export default async function Page() {
  const { userId } = auth();

  if (userId) {
    const notes = await getCloudNotes(userId);
    const parsedNotes: Note[] = JSON.parse(JSON.stringify(notes));
    const todos = (await getTodos(userId)) ?? [];
    const parsedTodos: Todo[] = JSON.parse(JSON.stringify(todos));

    return (
      <div className='min-h-screen w-full overflow-x-hidden'>
        <div className='flex items-center justify-between px-5 pt-4 font-medium text-xl capitalize'>
          <div className='flex items-center justify-start gap-x-3'>
            <NavDrawer notes={parsedNotes} />
            <h2>Todos</h2>
          </div>
        </div>
        <div className='pb-5 px-5 pt-3 gap-3 w-full'>
          <Todos todos={parsedTodos} />
        </div>
      </div>
    );
  }
}
