import { continueConversation } from '../actions';

export default async function getAutocompleteSuggestion(prompt: string) {
  try {
    const response = await continueConversation(prompt);

    return response;
  } catch (error) {
    console.error('Error calling autocomplete API:', error);
    return null;
  }
}
