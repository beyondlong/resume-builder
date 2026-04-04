const { requestAICompletion } = require('../providers');
const { buildJobRecommendationPrompt } = require('../prompts/job-recommendation');
const { resolveAIConfig } = require('../utils/env');
const { parseStructuredPayload } = require('../utils/normalize-response');

const createErrorResponse = (statusCode, code, message) => ({
  statusCode,
  payload: {
    error: {
      code,
      message,
    },
  },
});

const parseJobRecommendationPayload = content => {
  const parsed = parseStructuredPayload(content);

  if (typeof parsed?.summary !== 'string' || !Array.isArray(parsed?.roles)) {
    const error = new Error('AI response does not contain job recommendations');
    error.code = 'AI_INVALID_RESPONSE';
    throw error;
  }

  return {
    summary: parsed.summary,
    roles: parsed.roles,
  };
};

const handleJobRecommendationRequest = async (
  body,
  { env = process.env, fetchImpl } = {}
) => {
    if (!body || typeof body.resume !== 'object' || body.resume == null) {
      return createErrorResponse(
        400,
        'AI_BAD_REQUEST',
        'Resume context is required for job recommendation'
      );
    }

    let config;

    try {
      config = resolveAIConfig(env);
    } catch (error) {
      return createErrorResponse(
        500,
        error.code || 'AI_PROVIDER_NOT_CONFIGURED',
        error.message || 'AI provider is not configured'
      );
    }

    const requestFetch = fetchImpl || globalThis.fetch;

    if (!requestFetch) {
      return createErrorResponse(
        500,
        'AI_PROXY_UNAVAILABLE',
        'Fetch implementation is not available'
      );
    }

    try {
      const prompt = buildJobRecommendationPrompt(
        body.resume,
        body.language || 'zh-CN'
      );
      const content = await requestAICompletion(config, prompt, requestFetch);
      const payload = parseJobRecommendationPayload(content);

      return {
        statusCode: 200,
        payload,
      };
    } catch (error) {
      return createErrorResponse(
        502,
        error.code || 'AI_UPSTREAM_REQUEST_FAILED',
        error.message || 'AI upstream request failed'
      );
    }
};

module.exports = {
  handleJobRecommendationRequest,
  parseJobRecommendationPayload,
};
