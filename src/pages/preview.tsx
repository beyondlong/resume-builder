import { Resume } from '@/components/Resume';
import type { ResumeConfig, ThemeConfig } from '@/components/types';
import { ColorPicker } from '@/components/FormCreator/ColorPicker';
import { exportDataToLocal } from '@/helpers/export-to-local';
import { loadFromStorage, saveToStorage } from '@/helpers/storage';
import { loadResolvedResumeConfig } from '@/helpers/resume-config';
import {
  buildThemeConfig,
  DEFAULT_THEME,
  normalizeThemeConfig,
  PRESET_THEME_COLORS,
} from '@/helpers/theme';
import { getLanguage, getLocale, registerLocale } from '@/i18n';
import EN_US_LOCALE from '@/i18n/locales/en-US.json';
import ZH_CN_LOCALE from '@/i18n/locales/zh-CN.json';
import {
  BgColorsOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { Button, Popover, Select, Spin, message } from 'antd';
import { Link } from 'gatsby';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, IntlProvider, useIntl } from 'react-intl';
import './preview.less';

registerLocale('en-US', EN_US_LOCALE);
registerLocale('zh-CN', ZH_CN_LOCALE);

const PreviewPageContent: React.FC = () => {
  const lang = getLanguage();
  const intl = useIntl();

  const [config, setConfig] = useState<ResumeConfig>();
  const [loading, setLoading] = useState(true);
  const [themePanelOpen, setThemePanelOpen] = useState(false);

  const getTemplateFromUrl = (): string => {
    if (typeof window === 'undefined') return 'template1';
    const params = new URLSearchParams(window.location.search);
    return params.get('template') || 'template1';
  };

  const [currentTemplate, setCurrentTemplate] = useState(getTemplateFromUrl);

  useEffect(() => {
    setConfig(loadResolvedResumeConfig(lang));
    setLoading(false);
  }, [lang]);

  const handleTemplateChange = (value: string) => {
    setCurrentTemplate(value);

    const url = new URL(window.location.href);
    url.searchParams.set('template', value);
    window.history.replaceState(
      {},
      '',
      `${url.pathname}${url.search}${url.hash}`
    );
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

  const currentTheme: ThemeConfig = normalizeThemeConfig(config?.theme);
  const isDefaultTheme = currentTheme.color === DEFAULT_THEME.color;

  const themePanelContent = (
    <div className="theme-settings-panel">
      <div className="theme-settings-preview">
        <span className="theme-settings-label">
          <FormattedMessage id="当前主色" />
        </span>
        <div className="theme-settings-preview-value">
          <span
            className="theme-settings-preview-chip"
            style={{ backgroundColor: currentTheme.color }}
          />
          <code>{currentTheme.color}</code>
        </div>
      </div>
      <div className="theme-settings-row">
        <span className="theme-settings-label">
          <FormattedMessage id="主题色" />
        </span>
        <ColorPicker
          value={currentTheme.color}
          onChange={handleThemeChange}
          className="theme-settings-picker"
          style={{ width: 28, height: 28, borderRadius: 999 }}
        />
      </div>
      <div className="theme-settings-presets">
        <div className="theme-settings-label">
          <FormattedMessage id="预设主题" />
        </div>
        <div className="theme-settings-swatch-list">
          {PRESET_THEME_COLORS.map(color => {
            const isActive = currentTheme.color === color;

            return (
              <button
                key={color}
                type="button"
                className={`theme-settings-swatch${
                  isActive ? ' is-active' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleThemeChange(color)}
                aria-label={`theme-${color}`}
              />
            );
          })}
        </div>
      </div>
      <Button size="small" onClick={handleThemeReset} disabled={isDefaultTheme}>
        <FormattedMessage id="恢复默认" />
      </Button>
    </div>
  );

  return (
    <div className="preview-page">
      <div className="preview-header">
        <Link to="/" className="back-link">
          ← <FormattedMessage id="返回编辑" />
        </Link>
        <div className="preview-actions">
          <Select
            value={currentTemplate}
            onChange={handleTemplateChange}
            style={{ width: 160 }}
            size="small"
          >
            <Select.Option value="template4">现代简洁模板</Select.Option>
            <Select.Option value="template1">经典模板</Select.Option>
            <Select.Option value="template2">简易模板</Select.Option>
            <Select.Option value="template3">多页模板</Select.Option>
            <Select.Option value="template5">商务模板</Select.Option>
          </Select>
          <Popover
            content={themePanelContent}
            trigger="click"
            open={themePanelOpen}
            onOpenChange={setThemePanelOpen}
            placement="bottomRight"
          >
            <Button
              type="primary"
              shape="round"
              size="small"
              icon={<BgColorsOutlined />}
            >
              <FormattedMessage id="主题设置" />
            </Button>
          </Popover>
          <Button
            type="primary"
            shape="round"
            size="small"
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            <FormattedMessage id="导出配置" />
          </Button>
          <Button
            type="primary"
            shape="round"
            size="small"
            icon={<PrinterOutlined />}
            onClick={() => window.print()}
          >
            <FormattedMessage id="下载 PDF" />
          </Button>
        </div>
      </div>

      <div className="preview-content">
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
  );
};

const PreviewPage = () => {
  const lang = getLanguage();

  return (
    <IntlProvider locale={lang} messages={getLocale(lang)}>
      <Helmet>
        <title>预览简历 - Resume Generator</title>
      </Helmet>
      <PreviewPageContent />
    </IntlProvider>
  );
};

export default PreviewPage;
