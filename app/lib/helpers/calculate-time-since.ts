// either I suck or dates are incredibly hard

export default function calculateTimeSince(dateString: string): string {
  // Split the date string into parts
  const parts = dateString.split(/[ ,:]+/);

  // Parse the parts into date components
  const [day, month, year] = parts[0].split('/').map(Number);
  const [hour, minute, second] = parts.slice(1).map(Number);

  // Check if parsed date components are valid
  if (
    isNaN(day) ||
    isNaN(month) ||
    isNaN(year) ||
    isNaN(hour) ||
    isNaN(minute) ||
    isNaN(second)
  ) {
    return 'Invalid date';
  }

  // Create a new Date object
  const date = new Date(year, month - 1, day, hour, minute, second);

  // Get the current date
  const currentDate = new Date();

  // Check if the date is today
  if (isSameDay(date, currentDate)) {
    return 'Today';
  }

  // Get yesterday's date
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if the date is yesterday
  if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  }

  // Calculate the difference in milliseconds
  const differenceInTime = currentDate.getTime() - date.getTime();

  // Convert milliseconds to days
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

  return `${differenceInDays} days ago`;
}

// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
