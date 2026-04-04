import type { AIMockInterviewResponse } from '@/services/ai/types';
import { Alert, Drawer, Empty, Spin } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { InterviewQuestionCard } from './InterviewQuestionCard';

export const InterviewDrawer: React.FC<{
  open: boolean;
  loading: boolean;
  error: string | null;
  data: AIMockInterviewResponse | null;
  onClose: () => void;
}> = ({ open, loading, error, data, onClose }) => {
  return (
    <Drawer
      visible={open}
      onClose={onClose}
      width={460}
      title={<FormattedMessage id="AI模拟面试" />}
      className="ai-tool-drawer ai-mock-interview-drawer-shell"
    >
      <div className="ai-mock-interview-drawer">
        <Spin spinning={loading}>
          {error ? <Alert type="error" message={error} showIcon /> : null}
          {!loading && !error && data ? (
            <>
              <Alert
                type="info"
                message={<FormattedMessage id="模拟面试概览" />}
                description={data.summary}
                showIcon
              />
              <div className="ai-mock-interview-drawer__list">
                {data.questions.map((item, index) => (
                  <InterviewQuestionCard
                    key={`${index}-${item.question}`}
                    question={item}
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
