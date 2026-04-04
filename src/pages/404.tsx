import React from 'react';
import { Link } from 'gatsby';
import { buildLocalizedPath } from '@/helpers/location';
import { getLanguage, getLocale, registerLocale } from '@/i18n';
import { IntlProvider } from 'react-intl';
import EN_US_LOCALE from '@/i18n/locales/en-US.json';
import ZH_CN_LOCALE from '@/i18n/locales/zh-CN.json';

registerLocale('en-US', EN_US_LOCALE);
registerLocale('zh-CN', ZH_CN_LOCALE);

const NotFoundPage: React.FC = () => {
  const lang = getLanguage();

  return (
    <IntlProvider locale={lang} messages={getLocale(lang)}>
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '12px',
          background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
          color: '#2f3640',
        }}
      >
        <h1 style={{ margin: 0 }}>404</h1>
        <p style={{ margin: 0 }}>
          {lang === 'en-US' ? 'Page not found' : '页面不存在'}
        </p>
        <Link to={buildLocalizedPath('/')}>
          {lang === 'en-US' ? 'Back to editor' : '返回编辑页'}
        </Link>
      </main>
    </IntlProvider>
  );
};

export default NotFoundPage;
