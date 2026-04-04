import type {
  AIErrorResponse,
  AIJobRecommendationResponse,
  ResumeAIContext,
} from './types';

const getAIProxyBaseUrl = (): string => {
  const explicitBaseUrl = process.env.GATSBY_AI_API_BASE_URL;

  if (explicitBaseUrl) {
    return explicitBaseUrl.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const { hostname } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8787';
    }
  }

  return '';
};

export const requestJobRecommendation = async ({
  resume,
  language,
}: {
  resume: ResumeAIContext;
  language: ResumeAIContext['language'];
}): Promise<AIJobRecommendationResponse> => {
  let response: Response;

  try {
    response = await fetch(`${getAIProxyBaseUrl()}/api/ai/job-recommendation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume,
        language,
      }),
    });
  } catch (_error) {
    throw new Error('AI_PROXY_UNAVAILABLE');
  }

  if (!response.ok) {
    let errorPayload: AIErrorResponse | null = null;

    try {
      errorPayload = (await response.json()) as AIErrorResponse;
    } catch (_error) {
      throw new Error('AI_REQUEST_FAILED');
    }

    const error = new Error(
      errorPayload?.error?.message || 'AI request failed'
    );
    error.name = errorPayload?.error?.code || 'AI_REQUEST_FAILED';
    throw error;
  }

  return (await response.json()) as AIJobRecommendationResponse;
};
