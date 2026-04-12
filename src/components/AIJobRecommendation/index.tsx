import type { ResumeConfig } from '@/components/types';
import { useAIDrawerRequest } from '@/components/shared/useAIDrawerRequest';
import { buildResumeAIContext, requestJobRecommendation } from '@/services/ai';
import type { AIJobRecommendationResponse } from '@/services/ai/types';
import { RobotOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { RecommendationDrawer } from './RecommendationDrawer';
import './index.less';

export const AIJobRecommendation: React.FC<{
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
  } = useAIDrawerRequest<AIJobRecommendationResponse>({
    request: async () => {
      const resume = buildResumeAIContext(
        config,
        intl.locale as 'zh-CN' | 'en-US'
      );

      return requestJobRecommendation({
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
        className="ai-tool-trigger ai-tool-trigger--editor"
        onClick={handleOpen}
      >
        <FormattedMessage id="AI岗位推荐" />
      </Button>
      <RecommendationDrawer
        open={open}
        loading={loading}
        error={error}
        data={data}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
