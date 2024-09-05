export const getContentPreview = (content: string): string => {
  try {
    const parsedContent = JSON.parse(content);
    if (
      parsedContent &&
      parsedContent.content &&
      parsedContent.content[0] &&
      parsedContent.content[0].content &&
      parsedContent.content[0].content[0]
    ) {
      return parsedContent.content[0].content[0].text || '';
    }
    return 'Content structure invalid';
  } catch (error) {
    console.error('Error parsing note content:', error);
    return 'Error parsing content';
  }
};
