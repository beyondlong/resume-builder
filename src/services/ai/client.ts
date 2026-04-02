import { buildResumeImprovePrompt } from './prompts';
import type {
  AIErrorResponse,
  AIImproveRequest,
  AIImproveResponse,
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

const buildAIProxyUrl = (): string => {
  const baseUrl = getAIProxyBaseUrl();
  return `${baseUrl}/api/ai/improve`;
};

export const improveResumeField = async (
  request: AIImproveRequest
): Promise<AIImproveResponse> => {
  let response: Response;

  try {
    response = await fetch(buildAIProxyUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        prompt: buildResumeImprovePrompt(request),
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

    throw new Error(errorPayload?.error?.code || 'AI_REQUEST_FAILED');
  }

  return (await response.json()) as AIImproveResponse;
};
