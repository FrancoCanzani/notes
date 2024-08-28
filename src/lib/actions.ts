"use server";

import connectToDatabase from "./db/connect-to-db";
import { Note } from "./db/schemas/note-schema";
import { revalidatePath } from "next/cache";
import { createStreamableValue } from "ai/rsc";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { z } from "zod";

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

export async function getArticleContent(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

    const reader = new Readability(doc);
    const article = reader.parse();

    console.log(article);

    if (!article) {
      throw new Error("Failed to extract article content");
    }

    return {
      source: "direct",
      cacheURL: url,
      article: {
        title: article.title || "",
        content: article.content || "",
        textContent: article.textContent || "",
        length: article.textContent?.length || 0,
        siteName: article.siteName || new URL(url).hostname,
        byline: article.byline || "",
        dir: article.dir || "",
        lang: article.lang || "",
      },
      status: "success",
    };
  } catch (error) {
    console.error(`Error fetching article: ${error}`);
    return {
      source: "direct",
      cacheURL: url,
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
