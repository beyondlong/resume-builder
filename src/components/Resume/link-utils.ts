export const openExternalLink = (url?: string) => {
  if (!url || typeof window === 'undefined') {
    return;
  }

  window.open(url);
};
