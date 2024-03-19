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
    return savedUser;
  } catch (error) {
    console.error('Error handling user:', error);
    throw error;
  }
}

export async function getCloudNotes(userId: string | undefined) {
  if (!userId) {
    return;
  }
  try {
    await connectToDatabase();

    let notes = await Note.find({ userId });

    return notes;
  } catch (error) {
    throw error;
  }
}

export async function getCloudNote(userId: string | undefined, noteId: string) {
  if (!userId) {
    throw new Error('Missing user id for getCloudNote');
  }

  try {
    await connectToDatabase();

    const note = await Note.findOne({ userId, id: noteId });

    return note;
  } catch (error) {
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
        lastSaved: new Date().toLocaleString(),
      });
    } else {
      note.title = title;
      note.content = content;
      note.lastSaved = new Date().toLocaleString();
    }

    await note.save();
    revalidatePath('/notes', 'page');

    return note;
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

    return note;
  } catch (error) {
    throw error;
  }
}
