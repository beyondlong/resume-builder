import { buildPrintPopupHtml } from '@/features/preview/utils';
import { shouldUsePrintPopupFallback } from '@/helpers/browser-compat';
import React from 'react';

type Params = {
  lang: string;
  setThemePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPrinting: React.Dispatch<React.SetStateAction<boolean>>;
};

export const usePreviewPrint = ({
  lang,
  setThemePanelOpen,
  setIsPrinting,
}: Params) => {
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleBeforePrint = () => {
      setThemePanelOpen(false);
      setIsPrinting(true);
    };

    const handleAfterPrint = () => {
      setIsPrinting(false);
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [setIsPrinting, setThemePanelOpen]);

  return React.useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setThemePanelOpen(false);

    if (shouldUsePrintPopupFallback()) {
      const printShell = document.querySelector('.print-resume-shell');
      const printWindow = window.open('', '_blank');

      if (printShell && printWindow) {
        const styles = Array.from(
          document.querySelectorAll('style, link[rel="stylesheet"]')
        )
          .map(node => node.outerHTML)
          .join('');

        const html = buildPrintPopupHtml({
          lang,
          title: document.title,
          baseUri: document.baseURI,
          styles,
          content: printShell.innerHTML,
        });

        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        return;
      }
    }

    setIsPrinting(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    });
  }, [lang, setIsPrinting, setThemePanelOpen]);
};
