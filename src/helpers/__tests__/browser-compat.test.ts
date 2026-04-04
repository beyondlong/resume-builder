import {
  resolveStaticAssetUrl,
  shouldUsePrintPopupFallback,
} from '../browser-compat';

describe('resolveStaticAssetUrl', () => {
  test('prefixes absolute static asset paths with pathPrefix', () => {
    expect(resolveStaticAssetUrl('/images/avatar.png', '/resume-builder')).toBe(
      '/resume-builder/images/avatar.png'
    );
  });

  test('prefixes relative static asset paths with pathPrefix', () => {
    expect(resolveStaticAssetUrl('images/avatar.png', '/resume-builder')).toBe(
      '/resume-builder/images/avatar.png'
    );
  });

  test('does not duplicate an existing pathPrefix', () => {
    expect(
      resolveStaticAssetUrl(
        '/resume-builder/images/avatar.png',
        '/resume-builder'
      )
    ).toBe('/resume-builder/images/avatar.png');
  });

  test('keeps external urls untouched', () => {
    expect(resolveStaticAssetUrl('https://example.com/avatar.png')).toBe(
      'https://example.com/avatar.png'
    );
  });

  test('keeps data urls untouched', () => {
    expect(resolveStaticAssetUrl('data:image/png;base64,xxx')).toBe(
      'data:image/png;base64,xxx'
    );
  });
});

describe('shouldUsePrintPopupFallback', () => {
  test('returns true for safari user agents', () => {
    expect(
      shouldUsePrintPopupFallback(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15'
      )
    ).toBe(true);
  });

  test('returns false for chrome user agents', () => {
    expect(
      shouldUsePrintPopupFallback(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      )
    ).toBe(false);
  });
});
