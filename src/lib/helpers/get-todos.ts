import connectToDatabase from '../db/connect-to-db';
import { Todo } from '../db/schemas/todo-schema';

export default async function getTodos(userId: string | undefined) {
  try {
    if (!userId) {
      return null;
    }

    await connectToDatabase();
    const notes = await Todo.find({ userId: userId }).sort({ dueDate: 'asc' });

    if (!notes) {
      throw new Error('No notes found for the user');
    }

    return notes;
  } catch (error) {
    throw error;
  }
}
