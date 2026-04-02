const { requestDashScopeCompletion } = require('./dashscope');
const { requestOpenAICompatibleCompletion } = require('./openai-compatible');

const requestAICompletion = async (
  config,
  prompt,
  fetchImpl = fetch
) => {
  if (config.provider === 'dashscope') {
    return requestDashScopeCompletion(config, prompt, fetchImpl);
  }

  if (config.provider === 'openai-compatible') {
    return requestOpenAICompatibleCompletion(config, prompt, fetchImpl);
  }

  const error = new Error('Unsupported AI provider');
  error.code = 'AI_UNSUPPORTED_PROVIDER';
  throw error;
};

module.exports = {
  requestAICompletion,
};
