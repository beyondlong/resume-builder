import { buildLocalizedPath } from '@/helpers/location';

describe('buildLocalizedPath', () => {
  it('preserves current lang when building a new path', () => {
    window.history.replaceState({}, '', '/?lang=en-US&user=tester');

    expect(buildLocalizedPath('/preview', { template: 'template4' })).toBe(
      '/preview?lang=en-US&template=template4&user=tester'
    );
  });

  it('allows overriding current query values', () => {
    window.history.replaceState({}, '', '/?lang=zh-CN&template=template1');

    expect(buildLocalizedPath('/preview', { lang: 'en-US' })).toBe(
      '/preview?lang=en-US&template=template1'
    );
  });
});
