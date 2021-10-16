const baseUrlApi = '/api';

export const primaryColor = '#193d7b';

export function getApiUrl(url: string) {
  if (url.startsWith('/')) {
    url = url.substring(1);
  }
  return `${baseUrlApi}/${url}`;
}
