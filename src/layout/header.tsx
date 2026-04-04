import React, { useRef } from 'react';
import { navigate } from 'gatsby';
import { Button, message } from 'antd';
import { EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { LangSwitcher } from '@/components/LangSwitcher';
import { saveToStorage } from '@/helpers/storage';
import { buildLocalizedPath } from '@/helpers/location';
import type { ResumeConfig } from '@/components/types';
import './header.less';

type Props = {
  onImport: (config: ResumeConfig) => void;
};

const Header: React.FC<Props> = ({ onImport }) => {
  const intl = useIntl();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const json = event.target?.result as string;
        const data = JSON.parse(json) as ResumeConfig;
        onImport(data);
        message.success(intl.formatMessage({ id: '上传配置已应用' }));
        // 刷新页面以应用导入的配置
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch {
        message.error(intl.formatMessage({ id: '上传文件有误，请重新上传' }));
      }
      // 重置 input 值，以便相同文件可以再次导入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <header>
      <span className="header-title">
        {intl.formatMessage({ id: '简历编辑器' })}
      </span>
      <span className="header-actions">
        <Button
          type="primary"
          shape="round"
          icon={<EyeOutlined />}
          onClick={() =>
            navigate(buildLocalizedPath('/preview', { template: 'template4' }))
          }
        >
          {intl.formatMessage({ id: '预览' })}
        </Button>
        <Button
          type="primary"
          shape="round"
          icon={<UploadOutlined />}
          onClick={handleImportClick}
        >
          {intl.formatMessage({ id: '导入配置' })}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <LangSwitcher />
      </span>
    </header>
  );
};

export default Header;
