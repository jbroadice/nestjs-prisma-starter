export function getDateRangeFromDate(date: Date | string) {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setDate(start.getDate() + 1);
  return { start, end };
}
