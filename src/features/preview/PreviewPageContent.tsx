import { Resume } from '@/components/Resume';
import type { ResumeConfig, ThemeConfig } from '@/components/types';
import { exportDataToLocal } from '@/helpers/export-to-local';
import { loadFromStorage, saveToStorage } from '@/helpers/storage';
import { loadResolvedResumeConfig } from '@/helpers/resume-config';
import {
  buildThemeConfig,
  DEFAULT_THEME,
  normalizeThemeConfig,
} from '@/helpers/theme';
import { getLanguage } from '@/i18n';
import { Button, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { PreviewToolbar } from './PreviewToolbar';
import { ThemeSettingsPanel } from './ThemeSettingsPanel';
import {
  buildPreviewHistoryUrl,
  getTemplateFromSearch,
  isPreviewTemplate,
} from './utils';
import { usePreviewPrint } from './usePreviewPrint';
import type { ResumeTemplate } from '@/components/types';

export const PreviewPageContent: React.FC = () => {
  const lang = getLanguage();
  const intl = useIntl();

  const [config, setConfig] = useState<ResumeConfig>();
  const [loading, setLoading] = useState(true);
  const [themePanelOpen, setThemePanelOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<ResumeTemplate>(() =>
    typeof window === 'undefined'
      ? getTemplateFromSearch('')
      : getTemplateFromSearch(window.location.search)
  );

  useEffect(() => {
    setConfig(loadResolvedResumeConfig(lang));
    setLoading(false);
  }, [lang]);

  const handleTemplateChange = (value: string) => {
    const nextTemplate = isPreviewTemplate(value) ? value : 'template1';
    setCurrentTemplate(nextTemplate);

    if (typeof window !== 'undefined') {
      window.history.replaceState(
        {},
        '',
        buildPreviewHistoryUrl(window.location.href, nextTemplate)
      );
    }
  };

  const handleExport = () => {
    const data = loadFromStorage();
    if (data) {
      exportDataToLocal(JSON.stringify(data, null, 2), 'resume.json');
    } else {
      message.error(intl.formatMessage({ id: '暂无配置数据' }));
    }
  };

  const handleThemeChange = (color: string) => {
    setConfig(prevConfig => {
      if (!prevConfig) {
        return prevConfig;
      }

      const nextConfig = {
        ...prevConfig,
        theme: buildThemeConfig(color),
      };

      saveToStorage(nextConfig);

      return nextConfig;
    });
  };

  const handleThemeReset = () => {
    handleThemeChange(DEFAULT_THEME.color);
  };

  const handlePrint = usePreviewPrint({
    lang,
    setThemePanelOpen,
    setIsPrinting,
  });

  const currentTheme: ThemeConfig = normalizeThemeConfig(config?.theme);
  const isDefaultTheme = currentTheme.color === DEFAULT_THEME.color;

  const themePanelContent = (
    <ThemeSettingsPanel
      currentTheme={currentTheme}
      isDefaultTheme={isDefaultTheme}
      onThemeChange={handleThemeChange}
      onThemeReset={handleThemeReset}
    />
  );

  return (
    <div className={`preview-page${isPrinting ? ' is-printing' : ''}`}>
      <PreviewToolbar
        currentTemplate={currentTemplate}
        config={config}
        themePanelOpen={themePanelOpen}
        themePanelContent={themePanelContent}
        onTemplateChange={handleTemplateChange}
        onThemePanelOpenChange={setThemePanelOpen}
        onExport={handleExport}
        onPrint={handlePrint}
      />

      <div className="preview-content">
        <div className="print-resume-shell">
          <Spin spinning={loading}>
            {config && (
              <Resume
                value={config}
                theme={currentTheme}
                template={currentTemplate}
              />
            )}
          </Spin>
        </div>
      </div>
    </div>
  );
};
