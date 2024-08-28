"use server";

import connectToDatabase from "./db/connect-to-db";
import { Note } from "./db/schemas/note-schema";
import { revalidatePath } from "next/cache";
import { createStreamableValue } from "ai/rsc";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function continueConversation(text: string) {
  const result = await streamText({
    model: openai("gpt-4-turbo"),
    prompt:
      "You are an AI writing assistant that continues existing text based on context from prior text. " +
      "Give more weight/priority to the later characters than the beginning ones. " +
      "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
      `Here is the previous text: ${text}`,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}

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
