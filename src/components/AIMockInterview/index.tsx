import type { ResumeConfig } from '@/components/types';
import { useAIDrawerRequest } from '@/components/shared/useAIDrawerRequest';
import { buildResumeAIContext, requestMockInterview } from '@/services/ai';
import type { AIMockInterviewResponse } from '@/services/ai/types';
import { RobotOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { InterviewDrawer } from './InterviewDrawer';
import './index.less';

export const AIMockInterview: React.FC<{
  config: ResumeConfig;
}> = ({ config }) => {
  const intl = useIntl();
  const {
    open,
    loading,
    data,
    error,
    handleOpen,
    setOpen,
  } = useAIDrawerRequest<AIMockInterviewResponse>({
    request: async () => {
      const resume = buildResumeAIContext(
        config,
        intl.locale as 'zh-CN' | 'en-US'
      );

      return requestMockInterview({
        resume,
        language: resume.language,
      });
    },
    formatMessage: id => intl.formatMessage({ id }),
  });

  return (
    <>
      <Button
        type="default"
        size="small"
        icon={<RobotOutlined />}
        className="ai-tool-trigger ai-tool-trigger--preview"
        onClick={handleOpen}
      >
        <FormattedMessage id="AI模拟面试" />
      </Button>
      <InterviewDrawer
        open={open}
        loading={loading}
        error={error}
        data={data}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
