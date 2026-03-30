import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { IntlProvider } from 'react-intl';
import { getLanguage, registerLocale, getLocale } from '@/i18n';
import Header from '@/layout/header';
import Footer from '@/layout/footer';
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

const EditPageContent: React.FC<{
  initialConfig: ResumeConfig;
  importConfig: ResumeConfig | null;
  onImported: () => void;
}> = ({ initialConfig, importConfig, onImported }) => {
  const [config, setConfig] = useState<ResumeConfig>(
    initialConfig || ({} as ResumeConfig)
  );

  useEffect(() => {
    if (importConfig && typeof importConfig === 'object') {
      setConfig(importConfig);
      saveToStorage(importConfig);
      onImported();
    }
  }, [importConfig, onImported]);

  return (
    <ResumeConfigProvider initialValue={config}>
      <ResumeEditor />
    </ResumeConfigProvider>
  );
};

const EditPage = () => {
  const lang = getLanguage();
  const [initialConfig, setInitialConfig] = useState<ResumeConfig | null>(null);
  const [importConfig, setImportConfig] = useState<ResumeConfig | null>(null);

  useEffect(() => {
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
          saveToStorage(data);
          setInitialConfig(data);
        })
        .catch(() => {
          setInitialConfig(RESUME_INFO);
        });
    }
  }, []);

  const handleImport = useCallback((config: ResumeConfig) => {
    setImportConfig(config);
  }, []);

  const handleImported = useCallback(() => {
    setImportConfig(null);
  }, []);

  if (!initialConfig) {
    return null;
  }

  return (
    <IntlProvider locale={lang} messages={getLocale(lang)}>
      <Helmet>
        <title>编辑简历 - Resume Generator</title>
      </Helmet>
      <Header onImport={handleImport} />
      <EditPageContent
        initialConfig={initialConfig}
        importConfig={importConfig}
        onImported={handleImported}
      />
      <Footer />
    </IntlProvider>
  );
};

export default EditPage;
