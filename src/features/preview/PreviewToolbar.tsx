import { AIMockInterview } from '@/components/AIMockInterview';
import type { ResumeConfig, ResumeTemplate } from '@/components/types';
import { buildLocalizedPath } from '@/helpers/location';
import {
  BgColorsOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { Button, Popover, Select } from 'antd';
import { Link } from 'gatsby';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

type Props = {
  currentTemplate: ResumeTemplate;
  config?: ResumeConfig;
  themePanelOpen: boolean;
  themePanelContent: React.ReactNode;
  onTemplateChange: (value: string) => void;
  onThemePanelOpenChange: (open: boolean) => void;
  onExport: () => void;
  onPrint: () => void;
};

export const PreviewToolbar: React.FC<Props> = ({
  currentTemplate,
  config,
  themePanelOpen,
  themePanelContent,
  onTemplateChange,
  onThemePanelOpenChange,
  onExport,
  onPrint,
}) => {
  const intl = useIntl();

  return (
    <div className="preview-header">
      <Link to={buildLocalizedPath('/')} className="back-link">
        ← <FormattedMessage id="返回编辑" />
      </Link>
      <div className="preview-actions">
        <div className="preview-action-item preview-action-item--select">
          <Select
            value={currentTemplate}
            onChange={onTemplateChange}
            style={{ width: 160 }}
            size="small"
            className="preview-template-select"
          >
            <Select.Option value="template4">
              {intl.formatMessage({ id: '现代简洁模板' })}
            </Select.Option>
            <Select.Option value="template1">
              {intl.formatMessage({ id: '经典模板' })}
            </Select.Option>
            <Select.Option value="template2">
              {intl.formatMessage({ id: '简易模板' })}
            </Select.Option>
            <Select.Option value="template3">
              {intl.formatMessage({ id: '多页模板' })}
            </Select.Option>
            <Select.Option value="template5">
              {intl.formatMessage({ id: '商务模板' })}
            </Select.Option>
            <Select.Option value="template6">
              {intl.formatMessage({ id: '设计感杂志模板' })}
            </Select.Option>
            <Select.Option value="template7">
              {intl.formatMessage({ id: '技术极客模板' })}
            </Select.Option>
          </Select>
        </div>
        <div className="preview-action-item">
          <Popover
            content={themePanelContent}
            trigger="click"
            visible={themePanelOpen}
            onVisibleChange={onThemePanelOpenChange}
            placement="bottomRight"
          >
            <Button
              type="primary"
              shape="round"
              size="small"
              icon={<BgColorsOutlined />}
              className="preview-action-button"
            >
              <FormattedMessage id="主题设置" />
            </Button>
          </Popover>
        </div>
        <div className="preview-action-item">
          <Button
            type="primary"
            shape="round"
            size="small"
            icon={<DownloadOutlined />}
            onClick={onExport}
            className="preview-action-button"
          >
            <FormattedMessage id="导出配置" />
          </Button>
        </div>
        <div className="preview-action-item">
          <Button
            type="primary"
            shape="round"
            size="small"
            icon={<PrinterOutlined />}
            onClick={onPrint}
            className="preview-action-button"
          >
            <FormattedMessage id="下载 PDF" />
          </Button>
        </div>
        <div className="preview-action-item">
          {config ? <AIMockInterview config={config} /> : null}
        </div>
      </div>
    </div>
  );
};
