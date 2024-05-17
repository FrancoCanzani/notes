'use server';

import { User as UserSchema } from './db/schemas/user-schema';
import connectToDatabase from './db/connect-to-db';
import { Note } from './db/schemas/note-schema';
import { nanoid } from 'nanoid';
import { getUnifiedId } from './helpers/get-unified-id';

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string;
}

export async function handleUser(userData: UserData) {
  const { email, id, name, image } = userData;
  try {
    await connectToDatabase();

    let existingUser = await UserSchema.findOne({ email });

    if (!existingUser) {
      const newUnifiedId = nanoid(10);
      existingUser = new UserSchema({
        name,
        email,
        unifiedId: newUnifiedId,
        linkedProviders: [id],
        image,
        creation: new Date(),
        lastSaved: new Date(),
      });
    } else if (!existingUser.linkedProviders.includes(id)) {
      existingUser.linkedProviders.push(id);
      existingUser.lastSaved = new Date();
    }

    console.log(existingUser);

    const savedUser = await existingUser.save();
    return JSON.parse(JSON.stringify(savedUser));
  } catch (error) {
    console.error('Error handling user:', error);
    throw error;
  }
}

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
    const unifiedId = await getUnifiedId(userId);
    await connectToDatabase();

    let note = await Note.findOne({ userId: unifiedId, id: noteId });

    if (!note) {
      note = new Note({
        userId: unifiedId,
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
    const unifiedId = await getUnifiedId(userId);
    await connectToDatabase();

    const note = await Note.findOneAndDelete({ userId: unifiedId, id: noteId });

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
    const unifiedId = await getUnifiedId(userId);
    await connectToDatabase();

    const note = await Note.findOne({ userId: unifiedId, id: noteId });

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
    const unifiedId = await getUnifiedId(userId);
    await connectToDatabase();

    const note = await Note.findOne({ userId: unifiedId, id: noteId });

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
    const unifiedId = await getUnifiedId(userId);
    await connectToDatabase();

    const note = await Note.findOne({ userId: unifiedId, id: noteId });

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
