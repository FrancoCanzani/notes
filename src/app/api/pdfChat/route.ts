import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, pdfContent } = await req.json();

  console.log(pdfContent);

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: messages,
    system: `You are a professional pdf assistant. You answer questions in a simple, clear, and concise way. Here is the pdf content: ${pdfContent}`,
  });

  return result.toDataStreamResponse();
}
