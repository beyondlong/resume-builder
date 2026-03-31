import { Resume } from '@/components/Resume';
import type { ResumeConfig, ThemeConfig } from '@/components/types';
import { exportDataToLocal } from '@/helpers/export-to-local';
import { loadFromStorage } from '@/helpers/storage';
import { loadResolvedResumeConfig } from '@/helpers/resume-config';
import { getLanguage, getLocale, registerLocale } from '@/i18n';
import EN_US_LOCALE from '@/i18n/locales/en-US.json';
import ZH_CN_LOCALE from '@/i18n/locales/zh-CN.json';
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Select, Spin, message } from 'antd';
import { Link } from 'gatsby';
import _ from 'lodash-es';
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
  const [theme] = useState<ThemeConfig>({
    color: '#2f5785',
    tagColor: '#8bc34a',
  });

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
            <Resume value={config} theme={theme} template={currentTemplate} />
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
