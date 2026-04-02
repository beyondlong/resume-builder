import type { ResumeModuleKey } from '@/config/types';

export type AIImproveTarget = {
  moduleKey: ResumeModuleKey;
  fieldKey: string;
  itemIndex?: number;
  value?: string;
};

export type AIImproveCandidate = {
  id: string;
  content: string;
};

export type AIImproveRequest = {
  target: AIImproveTarget;
  sourceText: string;
  language?: 'zh-CN' | 'en-US';
};

export type AIImproveResponse = {
  candidates: AIImproveCandidate[];
};

export type AIErrorCode =
  | 'AI_PROXY_UNAVAILABLE'
  | 'AI_PROVIDER_NOT_CONFIGURED'
  | 'AI_INVALID_RESPONSE'
  | 'AI_UPSTREAM_REQUEST_FAILED'
  | 'AI_BAD_REQUEST'
  | 'AI_REQUEST_FAILED';

export type AIErrorResponse = {
  error: {
    code: AIErrorCode | string;
    message: string;
  };
};
