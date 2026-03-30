import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import { Helmet } from 'react-helmet';
import { IntlProvider } from 'react-intl';
import { getLanguage, registerLocale, getLocale } from '@/i18n';
import { ResumeConfigProvider } from '@/contexts/ResumeConfigContext';
import { ResumeEditor } from '@/components/ResumeEditor';
import { RESUME_INFO } from '@/data/resume';
import { loadFromStorage, saveToStorage } from '@/helpers/storage';
import type { ResumeConfig } from '@/components/types';
import EN_US_LOCALE from '@/i18n/locales/en-US.json';
import ZH_CN_LOCALE from '@/i18n/locales/zh-CN.json';
import './index.less';

registerLocale('en-US', EN_US_LOCALE);
registerLocale('zh-CN', ZH_CN_LOCALE);

const EditPageContent: React.FC = () => {
  const [initialConfig, setInitialConfig] = useState<ResumeConfig | null>(null);

  useEffect(() => {
    // 优先从 localStorage 读取，如果没有则从 /resume.json 读取
    const cached = loadFromStorage();
    if (cached) {
      setInitialConfig(cached);
    } else {
      fetch('/resume.json')
        .then(res => {
          if (!res.ok) throw new Error('Failed to load');
          return res.json();
        })
        .then(data => {
          saveToStorage(data); // 保存到本地缓存
          setInitialConfig(data);
        })
        .catch(() => {
          setInitialConfig(RESUME_INFO);
        });
    }
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  if (!initialConfig) {
    return null;
  }

  return (
    <ResumeConfigProvider initialValue={initialConfig}>
      <ResumeEditor onBack={handleBack} />
    </ResumeConfigProvider>
  );
};

const EditPage = () => {
  const lang = getLanguage();

  return (
    <IntlProvider locale={lang} messages={getLocale(lang)}>
      <Helmet>
        <title>编辑简历 - Resume Generator</title>
      </Helmet>
      <EditPageContent />
    </IntlProvider>
  );
};

export default EditPage;
