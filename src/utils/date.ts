export function formatDateAsISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function subtractDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
}