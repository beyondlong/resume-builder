import { PreviewPageContent } from '@/features/preview/PreviewPageContent';
import { getLanguage, getLocale, registerLocale } from '@/i18n';
import EN_US_LOCALE from '@/i18n/locales/en-US.json';
import ZH_CN_LOCALE from '@/i18n/locales/zh-CN.json';
import React from 'react';
import { Helmet } from 'react-helmet';
import { IntlProvider } from 'react-intl';
import './preview.less';

registerLocale('en-US', EN_US_LOCALE);
registerLocale('zh-CN', ZH_CN_LOCALE);

const PreviewPage = () => {
  const lang = getLanguage();

  return (
    <IntlProvider locale={lang} messages={getLocale(lang)}>
      <Helmet>
        <title>
          {lang === 'en-US'
            ? 'Preview Resume - Resume Generator'
            : '预览简历 - Resume Generator'}
        </title>
      </Helmet>
      <PreviewPageContent />
    </IntlProvider>
  );
};

export default PreviewPage;
