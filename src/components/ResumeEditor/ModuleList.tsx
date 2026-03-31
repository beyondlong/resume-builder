import React from 'react';
import { List, Badge } from 'antd';
import _ from 'lodash-es';
import { useIntl } from 'react-intl';
import { getResumeModules } from '@/config/resume-modules';
import type { ResumeConfig } from '@/components/types';
import type { ResumeModuleKey } from '@/config/types';

type Props = {
  selectedKey: ResumeModuleKey;
  onSelect: (key: ResumeModuleKey) => void;
  config: ResumeConfig;
};

export const ModuleList: React.FC<Props> = ({
  selectedKey,
  onSelect,
  config,
}) => {
  const intl = useIntl();
  const modules = getResumeModules({ intl });

  const getCount = (key: ResumeModuleKey): number => {
    const value = _.get(config, key);
    if (Array.isArray(value)) {
      return value.length;
    }
    return 0;
  };

  return (
    <List
      dataSource={modules}
      renderItem={module => {
        const count = getCount(module.key);
        return (
          <List.Item
            className={`module-item ${
              selectedKey === module.key ? 'selected' : ''
            }`}
            onClick={() => onSelect(module.key)}
          >
            <List.Item.Meta
              avatar={<span className="module-icon">{module.icon}</span>}
              title={
                <span className="module-name">
                  {module.name}
                  {count > 0 && (
                    <Badge
                      count={count}
                      style={{ marginLeft: 8 }}
                      size="small"
                    />
                  )}
                </span>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};
