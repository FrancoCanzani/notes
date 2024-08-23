"use server";

import connectToDatabase from "./db/connect-to-db";
import { Note } from "./db/schemas/note-schema";
import { Folder } from "./db/schemas/folder-schema";
import { revalidatePath } from "next/cache";

export async function saveNote(
  userId: string,
  noteId: string,
  title: string,
  content: string
) {
  if (!userId) {
    throw new Error("Missing user id for saveNote");
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

export async function deleteNote(userId: string | undefined, noteId: string) {
  if (!userId) {
    throw new Error("Missing user id for deleteNote");
  }

  try {
    await connectToDatabase();

    const note = await Note.findOneAndDelete({ userId: userId, id: noteId });

    const parsedResponse = JSON.parse(JSON.stringify(note));
    revalidatePath("/notes");
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
    throw new Error("Missing user id for updateNoteStatus");
  }

  try {
    await connectToDatabase();

    const note = await Note.findOne({ userId: userId, id: noteId });

    if (!note) {
      throw new Error("Note not found");
    }

    note.status = newStatus;

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
    throw new Error("Missing user id for updatePublishedStatus");
  }

  try {
    await connectToDatabase();

    const note = await Note.findOne({ userId: userId, id: noteId });

    if (!note) {
      throw new Error("Note not found");
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
    throw new Error("Missing user id for updatePinStatus");
  }

  try {
    await connectToDatabase();

    const note = await Note.findOne({ userId, id: noteId });

    if (!note) {
      throw new Error("Note not found");
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

export async function createFolder(name: string, userId: string) {
  await connectToDatabase();

  const newFolder = new Folder({ name, userId });
  await newFolder.save();

  revalidatePath("/notes");
  return;
}
