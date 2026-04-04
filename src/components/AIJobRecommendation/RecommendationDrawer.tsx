import type { AIJobRecommendationResponse } from '@/services/ai/types';
import { Alert, Drawer, Empty, Spin } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { RecommendationCard } from './RecommendationCard';

export const RecommendationDrawer: React.FC<{
  open: boolean;
  loading: boolean;
  error: string | null;
  data: AIJobRecommendationResponse | null;
  onClose: () => void;
}> = ({ open, loading, error, data, onClose }) => {
  return (
    <Drawer
      visible={open}
      onClose={onClose}
      width={420}
      title={<FormattedMessage id="AI岗位推荐" />}
      className="ai-tool-drawer ai-job-recommendation-drawer-shell"
    >
      <div className="ai-job-recommendation-drawer">
        <Spin spinning={loading}>
          {error ? <Alert type="error" message={error} showIcon /> : null}
          {!loading && !error && data ? (
            <>
              <Alert
                type="info"
                message={<FormattedMessage id="岗位推荐概览" />}
                description={data.summary}
                showIcon
              />
              <div className="ai-job-recommendation-drawer__list">
                {data.roles.map(role => (
                  <RecommendationCard
                    key={`${role.title}-${role.score}`}
                    role={role}
                  />
                ))}
              </div>
            </>
          ) : null}
          {!loading && !error && !data ? (
            <Empty description={<FormattedMessage id="暂无数据" />} />
          ) : null}
        </Spin>
      </div>
    </Drawer>
  );
};
