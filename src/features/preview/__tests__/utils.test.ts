import {
  buildPreviewHistoryUrl,
  buildPrintPopupHtml,
  getTemplateFromSearch,
} from '@/features/preview/utils';

describe('preview utils', () => {
  it('reads the template from search params and falls back to template1', () => {
    expect(getTemplateFromSearch('?template=template4')).toBe('template4');
    expect(getTemplateFromSearch('?foo=bar')).toBe('template1');
    expect(getTemplateFromSearch('')).toBe('template1');
  });

  it('updates the current url with the selected template', () => {
    expect(
      buildPreviewHistoryUrl(
        'https://example.com/preview?lang=en-US#section',
        'template3'
      )
    ).toBe('https://example.com/preview?lang=en-US&template=template3#section');
  });

  it('builds print popup html with the provided shell content', () => {
    const html = buildPrintPopupHtml({
      lang: 'en-US',
      title: 'Preview Resume',
      baseUri: 'https://example.com/',
      styles: '<style>.resume{color:red;}</style>',
      content: '<div class="resume">Resume</div>',
    });

    expect(html).toContain('<html lang="en-US">');
    expect(html).toContain('<base href="https://example.com/" />');
    expect(html).toContain('<div class="resume">Resume</div>');
    expect(html).toContain('.preview-header');
  });
});
