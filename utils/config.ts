const baseUrlApi = '/api';

export function getApiUrl(url: string) {
  if (url.startsWith('/')) {
    url = url.substring(1);
  }
  return `${baseUrlApi}/${url}`;
}
