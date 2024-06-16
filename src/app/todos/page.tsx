import NavDrawer from '../../components/nav-drawer';
import { auth } from '@clerk/nextjs/server';
import getCloudNotes from '../../lib/helpers/get-cloud-notes';
import { Note, Todo } from '../../lib/types';
import Todos from '../../components/todos';
import getTodos from '../../lib/helpers/get-todos';
import TodosNavbar from '../../components/todos-navbar';

export default async function Page() {
  const { userId } = auth();

  if (userId) {
    const notes = await getCloudNotes(userId);
    const parsedNotes: Note[] = JSON.parse(JSON.stringify(notes));
    const todos = (await getTodos(userId)) ?? [];
    const parsedTodos: Todo[] = JSON.parse(JSON.stringify(todos));

    return (
      <div className='min-h-screen flex flex-col lg:flex-row w-full overflow-x-hidden'>
        <div className='bg-neutral-50 w-full lg:flex-1 lg:h-[calc(100vh)]'>
          <div className='flex px-5 pt-4 items-center justify-start gap-x-3'>
            <NavDrawer notes={parsedNotes} />
            <h2 className='font-medium text-xl capitalize'>Calendar</h2>
          </div>
          <TodosNavbar todos={parsedTodos} />
        </div>
        <div>
          <h2 className='flex items-center justify-between px-5 pt-4 font-medium text-xl capitalize'>
            Todos
          </h2>
          <div className='p-5 flex-1 pt-3 gap-3 w-full lg:flex-1'>
            <Todos todos={parsedTodos} />
          </div>
        </div>
      </div>
    );
  }
}
