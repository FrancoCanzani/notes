'use client';

import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { deleteTodo, updateCompleted, updateTodoNotes } from '../lib/actions';
import { useAuth } from '@clerk/nextjs';
import { Todo } from '../lib/types';
import { toast } from 'sonner';
import {
  CrossCircledIcon,
  CheckCircledIcon,
  TrashIcon,
} from '@radix-ui/react-icons';

export default function Todos({ todos }: { todos: Todo[] }) {
  const { userId } = useAuth();

  const handleUpdateCompleted = async (id: string) => {
    if (userId) {
      try {
        await updateCompleted(userId, id);
      } catch {
        toast.error('Error updating todo');
      }
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (userId) {
      try {
        await deleteTodo(userId, id);
        toast.success('Deleted todo');
      } catch {
        toast.error('Error deleting todo');
      }
    }
  };

  return (
    <div className='w-full'>
      <ul className='space-y-2 w-full'>
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li
              key={todo.id}
              className={`border box-border w-full flex items-center flex-col justify-start gap-x-4 no-scrollbar transition-all duration-100 ease-[ease] p-2 md:p-4 text-sm md:text-base rounded-md border-solid border-[rgb(237,237,237)] hover:[--color-border:#E8E8E8] hover:bg-neutral-50 hover:shadow-[rgba(0,0,0,0.03)_0px_2px_6px]`}
            >
              <details className='w-full cursor-pointer space-y-3'>
                <summary className='flex w-full items-center justify-between space-x-1'>
                  <div
                    className={cn(`flex items-center max-w-[55%] md:max-w-[75%] justify-start space-x-2,
              ${todo.completed && 'line-through text-opaque'}`)}
                  >
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateCompleted(todo.id);
                      }}
                      title={
                        todo.completed ? 'Mark as pending' : 'Mark as completed'
                      }
                      className='p-1 w-fit inline-flex justify-center z-10 hover:text-black rounded'
                    >
                      {todo.completed ? (
                        <CrossCircledIcon />
                      ) : (
                        <CheckCircledIcon />
                      )}
                    </button>
                    <span className='truncate pr-2'>{todo.title}</span>
                  </div>
                  <div className='flex flex-1 items-center justify-end space-x-2'>
                    <div
                      className={cn(
                        'capitalize truncate text-sm text-opaque',
                        new Date(todo.dueDate).getTime() < Date.now() &&
                          'text-red-600'
                      )}
                    >
                      {formatDistanceToNow(todo.dueDate, {
                        addSuffix: true,
                      })}
                    </div>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className='text-red-500 font-medium hover:font-semibold hover:text-red-600'
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </summary>
                <form>
                  <label
                    htmlFor='notes'
                    className='font-medium text-xs p-2 mb-1 pl-1'
                  >
                    Notes
                  </label>
                  <textarea
                    className='rounded-md resize-none no-scrollbar w-full p-2 outline-none bg-neutral-100'
                    name='notes'
                    value={todo.notes}
                    id='notes'
                    placeholder='Notes about your task'
                    onChange={async (e) => {
                      if (userId) {
                        try {
                          const updatedNotes = e.target.value;
                          await updateTodoNotes(userId, todo.id, updatedNotes);
                        } catch {
                          toast.error(`Erro updating todo ${todo.title} notes`);
                        }
                      }
                    }}
                  />
                </form>
              </details>
            </li>
          ))
        ) : (
          <span className='inline-flex justify-center w-full capitalize my-16 text-center font-medium text-opaque'>
            Nothing to see here
          </span>
        )}
      </ul>
    </div>
  );
}
