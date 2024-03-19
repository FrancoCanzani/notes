// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default function calculateTimeSince(date: string | Date): string {
  if (!date) {
    return 'Invalid date';
  }

  let parsedDate: Date;

  if (typeof date === 'string') {
    // Attempt to parse the date string into a Date object
    parsedDate = new Date(date);

    // Check if the parsing was successful
    if (isNaN(parsedDate.getTime())) {
      // If parsing fails, try another parsing method
      parsedDate = new Date(Date.parse(date));
      if (isNaN(parsedDate.getTime())) {
        return 'Invalid date';
      }
    }
  } else {
    parsedDate = date;
  }

  // Get the current date
  const currentDate = new Date();

  // Check if the date is today
  if (isSameDay(parsedDate, currentDate)) {
    return 'Today';
  }

  // Get yesterday's date
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if the date is yesterday
  if (isSameDay(parsedDate, yesterday)) {
    return 'Yesterday';
  }

  // Calculate the difference in milliseconds
  const differenceInTime = currentDate.getTime() - parsedDate.getTime();

  // Convert milliseconds to days
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

  return `${differenceInDays} days ago`;
}
