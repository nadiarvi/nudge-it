const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
};

export const formatDate = (dateInput: Date | string): string => {
  const date = typeof dateInput === 'string' 
    ? new Date(dateInput) 
    : dateInput;

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
};