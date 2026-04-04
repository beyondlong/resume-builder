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
  language?: ResumeAILanguage;
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

export type ResumeAILanguage = 'zh-CN' | 'en-US';

export type ResumeAIContext = {
  language: ResumeAILanguage;
  profile: {
    name?: string;
    city?: string;
    yearsOfExperienceHint?: string;
    currentTitle?: string;
  };
  summary: string;
  education: Array<{
    school?: string;
    major?: string;
    degree?: string;
    time?: string;
  }>;
  workExperience: Array<{
    company?: string;
    role?: string;
    time?: string;
    description?: string;
  }>;
  projects: Array<{
    name?: string;
    description?: string;
    responsibilities?: string;
    techHints?: string[];
  }>;
  skills: string[];
};

export type AIRecommendedRole = {
  title: string;
  score: number;
  industries: string[];
  companyTypes: string[];
  techTags: string[];
  reasons: string[];
  suggestions: string[];
};

export type AIJobRecommendationResponse = {
  summary: string;
  roles: AIRecommendedRole[];
};

export type AIMockInterviewQuestion = {
  question: string;
  intent: string;
  answerGuidance: string[];
  resumeEvidence?: string;
};

export type AIMockInterviewResponse = {
  summary: string;
  questions: AIMockInterviewQuestion[];
};
