const { requestAICompletion } = require('../providers');
const { resolveAIConfig } = require('../utils/env');
const {
  buildClientResponse,
  parseCandidatePayload,
} = require('../utils/normalize-response');

const createErrorResponse = (statusCode, code, message) => ({
  statusCode,
  payload: {
    error: {
      code,
      message,
    },
  },
});

const handleAIImproveRequest = async (
  body,
  { env = process.env, fetchImpl } = {}
) => {
  if (!body || typeof body.prompt !== 'string' || !body.prompt.trim()) {
    return createErrorResponse(
      400,
      'AI_BAD_REQUEST',
      'Prompt is required for AI improvement'
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
    const content = await requestAICompletion(config, body.prompt, requestFetch);
    const candidates = parseCandidatePayload(content);

    return {
      statusCode: 200,
      payload: buildClientResponse(candidates),
    };
  } catch (error) {
    if (error.code === 'AI_INVALID_RESPONSE') {
      return createErrorResponse(502, error.code, error.message);
    }

    return createErrorResponse(
      502,
      error.code || 'AI_UPSTREAM_REQUEST_FAILED',
      error.message || 'AI upstream request failed'
    );
  }
};

module.exports = {
  handleAIImproveRequest,
};
