'use client';

import { Todo } from '../lib/types';
import * as chrono from 'chrono-node';
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { saveTodo } from '../lib/actions';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

type TodoCollection = {
  [key: string]: Todo[];
};

type GroupedTodos = {
  pending: TodoCollection;
  completed: Todo[];
};

export default function TodosNavbar({ todos }: { todos: Todo[] }) {
  const [newTodo, setNewTodo] = useState('');
  const { userId } = useAuth();
  const router = useRouter();

  const groupByDueDate = (todos: Todo[]): GroupedTodos => {
    return todos.reduce(
      (acc: GroupedTodos, todo) => {
        if (todo.completed) {
          acc.completed.push(todo);
        } else {
          const key = formatDistanceToNow(new Date(todo.dueDate), {
            addSuffix: true,
          });
          if (!acc.pending[key]) {
            acc.pending[key] = [];
          }
          acc.pending[key].push(todo);
        }
        return acc;
      },
      { pending: {}, completed: [] }
    );
  };

  const groupedTodos = groupByDueDate(todos);

  const handleAddTodo = async () => {
    if (userId && newTodo.trim() !== '') {
      try {
        const [description, dateStr] = newTodo.split('@');
        const todoDate = dateStr
          ? chrono.parseDate(dateStr.trim())
          : chrono.parseDate('tomorrow');

        await saveTodo(userId, description.trim(), todoDate ?? new Date());
        setNewTodo('');
        router.refresh();
      } catch {
        toast.error('Error adding todo');
      }
    }
  };

  return (
    <nav className='flex bg-neutral-50 p-5 flex-col w-full'>
      <div className='flex items-center justify-start gap-x-3'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTodo();
          }}
          className='flex mb-4 w-full'
        >
          <input
            type='text'
            placeholder='Get haircut @tomorrow 1pm'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className='flex-1 px-3 py-2 border rounded-l-md outline-none box-border w-full no-scrollbar transition-all duration-100 ease-[ease] delay-0 m-0 p-4 border-solid border-[rgb(237,237,237)] hover:[--color-border:#E8E8E8] bg-neutral-50 focus:bg-white hover:shadow-[rgba(0,0,0,0.03)_0px_2px_6px]'
          />
          <button
            type='submit'
            className='px-4 bg-stone-200 border font-medium hover:bg-stone-300 py-2 rounded-r-md'
          >
            Add
          </button>
        </form>
      </div>
      <div className='space-y-3 transition-all ease-in-out duration-200'>
        {Object.entries(groupedTodos.pending).map(([timeFrame, todoList]) => (
          <details
            key={timeFrame}
            className='w-full cursor-pointer space-y-3 transition-all ease-in-out duration-200'
            open
          >
            <summary className='font-medium capitalize cursor-pointer'>
              {timeFrame}
            </summary>
            <ul className='pl-2 space-y-2'>
              {todoList.map((todo) => (
                <li
                  key={todo.id}
                  className={`border box-border w-full transition-all duration-100 ease-[ease] p-2 md:p-4 text-sm md:text-base rounded-md border-solid border-[rgb(237,237,237)] hover:[--color-border:#E8E8E8] hover:bg-neutral-50 hover:shadow-[rgba(0,0,0,0.03)_0px_2px_6px]`}
                >
                  <h3 className=''>{todo.title}</h3>
                </li>
              ))}
            </ul>
          </details>
        ))}
        {groupedTodos.completed.length > 0 && (
          <details
            className='w-full cursor-pointer space-y-3 transition-all ease-in-out duration-200'
            open
          >
            <summary className='font-medium capitalize cursor-pointer'>
              Completed
            </summary>
            <ul className='pl-2 space-y-2'>
              {groupedTodos.completed.map((todo) => (
                <li
                  key={todo.id}
                  className={`border box-border w-full transition-all duration-100 ease-[ease] p-2 md:p-4 text-sm md:text-base rounded-md border-solid border-[rgb(237,237,237)] hover:[--color-border:#E8E8E8] hover:bg-neutral-50 hover:shadow-[rgba(0,0,0,0.03)_0px_2px_6px]`}
                >
                  <h3 className='text-opaque'>{todo.title}</h3>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </nav>
  );
}
