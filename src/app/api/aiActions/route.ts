import { openai } from "@ai-sdk/openai";
import { CoreMessage, streamText } from "ai";
import { match } from "ts-pattern";

export async function POST(req: Request): Promise<Response> {
  const { prompt, option } = await req.json();

  console.log(option);
  console.log(prompt);

  const messages = match(option)
    .with("continue", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that continues existing text based on context from prior text. " +
          "Give more weight/priority to the later characters than the beginning ones. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences.",
      },
      {
        role: "user",
        content: prompt,
      },
    ])
    .with("improve", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that improves existing text. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("shorter", () => [
      {
        role: "system",
        content: "You are an AI writing assistant that shortens existing text.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("longer", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that lengthens existing text.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("fix", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that fixes grammar and spelling errors in existing text. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("summarize", () => [
      {
        role: "system",
        content: "You are an AI writing assistant that summarizes text.",
      },
      {
        role: "user",
        content: `Summarize this text: ${prompt}`,
      },
    ])
    .with("rewrite", () => [
      {
        role: "system",
        content: "You are an AI writing assistant that rewrites text.",
      },
      {
        role: "user",
        content: `Rewrite this text: ${prompt}`,
      },
    ])
    .with("simplify", () => [
      {
        role: "system",
        content: "You are an AI writing assistant that simplifies text.",
      },
      {
        role: "user",
        content: `Simplify this text: ${prompt}`,
      },
    ])
    .with("formalize", () => [
      {
        role: "system",
        content: "You are an AI writing assistant that formalizes text.",
      },
      {
        role: "user",
        content: `Make this text more formal: ${prompt}`,
      },
    ])
    .with("casualize", () => [
      {
        role: "system",
        content: "You are an AI writing assistant that makes text more casual.",
      },
      {
        role: "user",
        content: `Make this text more casual: ${prompt}`,
      },
    ])
    .with("addTone", () => [
      {
        role: "system",
        content: "You are an AI writing assistant that adds a positive tone.",
      },
      {
        role: "user",
        content: `Add a positive tone to this text: ${prompt}`,
      },
    ])
    .with("negate", () => [
      {
        role: "system",
        content: "You are an AI writing assistant that adds a negative tone.",
      },
      {
        role: "user",
        content: `Add a negative tone to this text: ${prompt}`,
      },
    ])
    .run() as CoreMessage[];

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages,
  });

  return result.toDataStreamResponse();
}
