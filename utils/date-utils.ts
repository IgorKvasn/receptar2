export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('sk', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(date));
}
