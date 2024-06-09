'use client';

import { useState } from 'react';
import * as chrono from 'chrono-node';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { deleteTodo, saveTodo, updateCompleted } from '../lib/actions';
import { useAuth } from '@clerk/nextjs';
import { Todo } from '../lib/types';
import { toast } from 'sonner';

export default function Todos({ todos }: { todos: Todo[] }) {
  const [newTodo, setNewTodo] = useState('');
  const { userId } = useAuth();

  const handleAddTodo = async () => {
    if (userId) {
      if (newTodo.trim() !== '') {
        try {
          const [description, dateStr] = newTodo.split('@');
          const todoDate = dateStr
            ? chrono.parseDate(dateStr.trim())
            : chrono.parseDate('tomorrow');
          await saveTodo(userId, description, todoDate ?? new Date());
          setNewTodo('');
        } catch {
          toast.error('Error adding todo');
        }
      }
    }
  };

  const handleUpdateCompleted = async (id: string) => {
    if (userId) {
      await updateCompleted(userId, id);
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
      <div className='flex items-center justify-start gap-x-3'>
        <form action={handleAddTodo} className='flex mb-4 w-full'>
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
      <ul className='space-y-2 w-full'>
        {todos ? (
          todos.map((todo) => (
            <li
              key={todo.id}
              className={`border box-border w-full flex items-center justify-start gap-x-4 no-scrollbar transition-all duration-100 ease-[ease] p-2 md:p-4 text-sm md:text-base rounded-md border-solid border-[rgb(237,237,237)] hover:[--color-primary:#343433] hover:[--color-text:#343433] hover:[--color-border:#E8E8E8] hover:bg-neutral-50 hover:shadow-[rgba(0,0,0,0.03)_0px_2px_6px]`}
            >
              <div
                className={cn(`flex items-center w-full space-x-4,
            ${todo.completed && 'line-through text-opaque'}`)}
              >
                <input
                  type='checkbox'
                  checked={todo.completed}
                  onChange={() => handleUpdateCompleted(todo.id)}
                  className='mr-2 rounded accent-black'
                />
                <span className='mr-3'>{todo.title}</span>
                {todo.dueDate && (
                  <span className='capitalize'>
                    {formatDistanceToNow(todo.dueDate, { addSuffix: true })}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className='text-red-500 font-medium opacity-75 hover:opacity-100 hover:text-red-600'
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <span>No todos yet</span>
        )}
      </ul>
    </div>
  );
}
