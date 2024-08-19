import { convertToCoreMessages, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages, selectedText } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    system: `You are an intelligent text editor assistant. Your role is to help users modify, enhance, or analyze selected text based on specific actions or commands they provide. Always perform the requested action on the exact text provided, unless instructed otherwise.
    
    Respond only with the modified text or the requested analysis. Do not include explanations or additional commentary unless specifically asked. If you need clarification to complete the task, ask for it directly.
    
    Remember, your goal is to assist efficiently and accurately, enhancing the user's writing and editing experience.
    
    User context text: ${selectedText}`,

    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
