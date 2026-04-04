import type { ResumeConfig } from '@/components/types';
import { buildResumeAIContext, requestJobRecommendation } from '@/services/ai';
import type { AIJobRecommendationResponse } from '@/services/ai/types';
import { RobotOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { RecommendationDrawer } from './RecommendationDrawer';
import './index.less';

const AI_ERROR_MESSAGE_IDS: Record<string, string> = {
  AI_PROXY_UNAVAILABLE: 'AI代理不可用',
  AI_PROVIDER_NOT_CONFIGURED: 'AI服务未配置',
  AI_INVALID_RESPONSE: 'AI返回结果解析失败',
  AI_UPSTREAM_REQUEST_FAILED: 'AI请求失败',
  AI_REQUEST_FAILED: 'AI请求失败',
};

export const AIJobRecommendation: React.FC<{
  config: ResumeConfig;
}> = ({ config }) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AIJobRecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    setError(null);

    try {
      const resume = buildResumeAIContext(
        config,
        intl.locale as 'zh-CN' | 'en-US'
      );
      const response = await requestJobRecommendation({
        resume,
        language: resume.language,
      });

      setData(response);
    } catch (err) {
      if (err instanceof Error) {
        const messageId =
          AI_ERROR_MESSAGE_IDS[err.name] || AI_ERROR_MESSAGE_IDS[err.message];
        setError(
          messageId ? intl.formatMessage({ id: messageId }) : err.message
        );
      } else {
        setError(intl.formatMessage({ id: 'AI请求失败' }));
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  };

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
