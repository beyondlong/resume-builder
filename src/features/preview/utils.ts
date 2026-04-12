export const DEFAULT_PREVIEW_TEMPLATE = 'template1';

export type PreviewTemplate =
  | 'template1'
  | 'template2'
  | 'template3'
  | 'template4'
  | 'template5';

type BuildPrintPopupHtmlParams = {
  lang: string;
  title: string;
  baseUri: string;
  styles: string;
  content: string;
};

export const isPreviewTemplate = (
  value: string | null
): value is PreviewTemplate =>
  value === 'template1' ||
  value === 'template2' ||
  value === 'template3' ||
  value === 'template4' ||
  value === 'template5';

export const getTemplateFromSearch = (search: string): PreviewTemplate => {
  const params = new URLSearchParams(search);
  const template = params.get('template');
  return isPreviewTemplate(template) ? template : DEFAULT_PREVIEW_TEMPLATE;
};

export const buildPreviewHistoryUrl = (
  currentHref: string,
  template: PreviewTemplate
): string => {
  const nextUrl = new URL(currentHref);
  nextUrl.searchParams.set('template', template);
  return nextUrl.toString();
};

export const buildPrintPopupHtml = ({
  lang,
  title,
  baseUri,
  styles,
  content,
}: BuildPrintPopupHtmlParams): string => `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8" />
    <base href="${baseUri}" />
    <title>${title}</title>
    ${styles}
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: #fff;
      }
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .preview-page {
        min-height: auto;
        background: #fff;
      }
      .preview-content {
        padding: 0 !important;
        display: block !important;
      }
      .print-resume-shell {
        width: 100%;
        max-width: none !important;
      }
      .preview-header {
        display: none !important;
      }
    </style>
  </head>
  <body>
    <div class="preview-page is-printing">
      <div class="preview-content">
        <div class="print-resume-shell">
          ${content}
        </div>
      </div>
    </div>
    <script>
      window.addEventListener('load', function () {
        setTimeout(function () {
          window.focus();
          window.print();
        }, 80);
      });
      window.addEventListener('afterprint', function () {
        window.close();
      });
    </script>
  </body>
</html>`;
