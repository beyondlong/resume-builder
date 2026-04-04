const ABSOLUTE_URL_PATTERN = /^(?:[a-z]+:)?\/\//i;

declare global {
  // Gatsby injects this global at runtime.
  // eslint-disable-next-line no-var
  var __PATH_PREFIX__: string | undefined;
}

const normalizePathPrefix = (pathPrefix?: string): string => {
  const rawPrefix =
    pathPrefix ??
    (typeof globalThis !== 'undefined' ? globalThis.__PATH_PREFIX__ : '');

  if (!rawPrefix || rawPrefix === '/') {
    return '';
  }

  return rawPrefix.endsWith('/') ? rawPrefix.slice(0, -1) : rawPrefix;
};

export const resolveStaticAssetUrl = (
  src?: string,
  pathPrefix?: string
): string => {
  if (!src) {
    return '';
  }

  if (
    ABSOLUTE_URL_PATTERN.test(src) ||
    src.startsWith('data:') ||
    src.startsWith('blob:')
  ) {
    return src;
  }

  const normalizedPrefix = normalizePathPrefix(pathPrefix);
  const normalizedSrc = src.startsWith('/') ? src : `/${src}`;

  if (
    normalizedPrefix &&
    (normalizedSrc === normalizedPrefix ||
      normalizedSrc.startsWith(`${normalizedPrefix}/`))
  ) {
    return normalizedSrc;
  }

  return normalizedPrefix
    ? `${normalizedPrefix}${normalizedSrc}`
    : normalizedSrc;
};

export const shouldUsePrintPopupFallback = (userAgent?: string): boolean => {
  const ua =
    userAgent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '');

  const isSafari =
    /Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR|CriOS/i.test(ua);

  return isSafari;
};
