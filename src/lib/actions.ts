'use server';

import { User } from './db/schemas/user-schema';
import connectToDatabase from './db/connect-to-db';
import { Note } from './db/schemas/note-schema';
import { revalidatePath } from 'next/cache';

interface UserProps {
  id: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
}

export async function handleUser(user: UserProps) {
  const { name, email, id, image } = user;

  try {
    await connectToDatabase();

    let existingUser = await User.findOne({ id });

    if (existingUser) {
      return existingUser;
    }

    const newUser = new User({
      name,
      email,
      id,
      image,
    });

    const savedUser = await newUser.save();
    const parsedResponse = JSON.parse(JSON.stringify(savedUser));
    return parsedResponse;
  } catch (error) {
    console.error('Error handling user:', error);
    throw error;
  }
}

export async function saveCloudNote(
  userId: string | undefined,
  noteId: string,
  title: string,
  content: string
) {
  if (!userId) {
    throw new Error('Missing user id for saveCloudNote');
  }

  try {
    await connectToDatabase();

    let note = await Note.findOne({ userId, id: noteId });

    if (!note) {
      note = new Note({
        userId,
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
    revalidatePath('/notes', 'page');

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

    const note = await Note.findOneAndDelete({ userId, id: noteId });

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

    const note = await Note.findOne({ userId, id: noteId });

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

    const note = await Note.findOne({ userId, id: noteId });

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

    const note = await Note.findOne({ userId, id: noteId });

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
