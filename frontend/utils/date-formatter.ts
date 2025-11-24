const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
};
