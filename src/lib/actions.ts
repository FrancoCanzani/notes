'use server';

import { nanoid } from 'nanoid';
import connectToDatabase from './db/connect-to-db';
import { Note } from './db/schemas/note-schema';
import { Todo } from './db/schemas/todo-schema';
import { redirect } from 'next/navigation';

export async function saveCloudNote(
  userId: string,
  noteId: string,
  title: string,
  content: string
) {
  if (!userId) {
    throw new Error('Missing user id for saveCloudNote');
  }

  try {
    await connectToDatabase();

    let note = await Note.findOne({ userId: userId, id: noteId });

    if (!note) {
      note = new Note({
        userId: userId,
        id: noteId,
        title,
        content,
        lastSaved: new Date(),
      });
    } else {
      note.title = title;
      note.content = content;
      note.lastSaved = new Date();
    }

    await note.save();

    const parsedResponse = JSON.parse(JSON.stringify(note));
    return parsedResponse;
  } catch (error) {
    throw error;
  }
}

export async function deleteCloudNote(
  userId: string | undefined,
  noteId: string
) {
  if (!userId) {
    throw new Error('Missing user id for deleteCloudNote');
  }

  try {
    await connectToDatabase();

    const note = await Note.findOneAndDelete({ userId: userId, id: noteId });

    const parsedResponse = JSON.parse(JSON.stringify(note));
    return parsedResponse;
  } catch (error) {
    throw error;
  }
}

export async function updateNoteStatus(
  userId: string | undefined,
  noteId: string,
  newStatus: string
) {
  if (!userId) {
    throw new Error('Missing user id for updateNoteStatus');
  }

  try {
    await connectToDatabase();

    const note = await Note.findOne({ userId: userId, id: noteId });

    if (!note) {
      throw new Error('Note not found');
    }

    note.status = newStatus;

    await note.save();

    const parsedResponse = JSON.parse(JSON.stringify(note));
    return parsedResponse;
  } catch (error) {
    throw error;
  }
}

export async function updateNoteLabel(
  userId: string | undefined,
  noteId: string,
  labelText: string,
  labelColor: string
) {
  if (!userId) {
    throw new Error('Missing user id for updateNoteStatus');
  }

  try {
    await connectToDatabase();

    const note = await Note.findOne({ userId: userId, id: noteId });

    if (!note) {
      throw new Error('Note not found');
    }

    note.label = {
      text: labelText,
      color: labelColor,
    };

    await note.save();
    const parsedResponse = JSON.parse(JSON.stringify(note));
    return parsedResponse;
  } catch (error) {
    throw error;
  }
}

export async function updatePublishedStatus(
  userId: string | undefined,
  noteId: string
) {
  if (!userId) {
    throw new Error('Missing user id for updatePublishedStatus');
  }

  try {
    await connectToDatabase();

    const note = await Note.findOne({ userId: userId, id: noteId });

    if (!note) {
      throw new Error('Note not found');
    }

    if (note.published === undefined) {
      note.published = true;
    } else {
      note.published = !note.published;
    }

    const updatedNote = await note.save();
    const parsedResponse = JSON.parse(JSON.stringify(updatedNote));
    return parsedResponse;
  } catch (error) {
    throw error;
  }
}

export async function updatePinStatus(
  userId: string | undefined,
  noteId: string
) {
  if (!userId) {
    throw new Error('Missing user id for updatePinStatus');
  }

  try {
    await connectToDatabase();

    const note = await Note.findOne({ userId, id: noteId });

    if (!note) {
      throw new Error('Note not found');
    }

    if (note.pinned === undefined) {
      note.pinned = false;
    } else {
      note.pinned = !note.pinned;
    }

    const updatedNote = await note.save();

    const parsedResponse = JSON.parse(JSON.stringify(updatedNote));

    return parsedResponse;
  } catch (error) {
    throw error;
  }
}

export async function saveTodo(userId: string, title: string, dueDate: Date) {
  if (!userId) {
    throw new Error('Missing user id for saveTodo');
  }

  try {
    await connectToDatabase();

    const newTodo = new Todo({
      title: title,
      id: nanoid(7),
      dueDate: dueDate,
      userId: userId,
    });

    await newTodo.save();
    redirect('/todos');
  } catch (error) {
    throw error;
  }
}

export async function updateCompleted(userId: string, todoId: string) {
  if (!userId) {
    throw new Error('Missing user id for updateCompleted');
  }

  try {
    await connectToDatabase();

    const todo = await Todo.findOne({ id: todoId });

    if (!todo) {
      throw new Error(`Todo with id ${todoId} not found`);
    }

    todo.completed = !todo.completed;
    await todo.save();

    redirect('/todos');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteTodo(userId: string, todoId: string) {
  if (!userId) {
    throw new Error('Missing user id for deleteTodo');
  }

  try {
    await connectToDatabase();

    const deletedTodo = await Todo.findOneAndDelete({ id: todoId });

    if (!deletedTodo) {
      throw new Error(`Todo with id ${todoId} not found`);
    }

    redirect('/todos');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateTodoNotes(
  userId: string,
  todoId: string,
  notes: string
) {
  if (!userId) {
    throw new Error('Missing user id for updateTodoNotes');
  }

  try {
    await connectToDatabase();

    const todo = await Todo.findOne({ id: todoId });

    if (!todo) {
      throw new Error(`Todo with id ${todoId} not found`);
    }

    todo.notes = notes;

    await todo.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
