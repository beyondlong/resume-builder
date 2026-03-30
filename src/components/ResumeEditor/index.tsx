import { useResumeConfig } from '@/contexts/ResumeConfigContext';
import { saveToStorage } from '@/helpers/storage';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';
import { ModuleForm } from './ModuleForm';
import { ModuleList } from './ModuleList';

export const ResumeEditor: React.FC = () => {
  const { config, updateConfig } = useResumeConfig();
  const [selectedModule, setSelectedModule] = useState('profile');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 每次 config 变化时自动保存到 localStorage
  useEffect(() => {
    saveToStorage(config);
    setLastSaved(new Date());
  }, [config]);

  return (
    <div className="resume-editor">
      <Row gutter={24} className="editor-content">
        <Col span={6}>
          <Card className="module-list-card">
            <ModuleList
              selectedKey={selectedModule}
              onSelect={setSelectedModule}
              config={config}
            />
          </Card>
        </Col>
        <Col span={18}>
          <Card className="module-form-card">
            <div className="save-indicator">
              <CheckCircleOutlined />
            </div>
            <ModuleForm
              moduleKey={selectedModule}
              config={config}
              onChange={updateConfig}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};