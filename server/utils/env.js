const fs = require('fs');
const path = require('path');

const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/api/v1';

const readEnvFile = filePath => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  lines.forEach(line => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
};

const loadEnvFiles = (cwd = process.cwd()) => {
  readEnvFile(path.join(cwd, '.env'));
  readEnvFile(path.join(cwd, '.env.local'));
};

const parseTimeout = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
};

const buildConfigError = (message, code = 'AI_PROVIDER_NOT_CONFIGURED') => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const resolveDashScopeConfig = env => {
  if (!env.DASHSCOPE_API_KEY) {
    throw buildConfigError('DashScope API key is missing');
  }

  return {
    provider: 'dashscope',
    apiKey: env.DASHSCOPE_API_KEY,
    baseUrl: env.DASHSCOPE_BASE_URL || DEFAULT_DASHSCOPE_BASE_URL,
    model: env.AI_MODEL,
    timeoutMs: parseTimeout(env.AI_TIMEOUT_MS),
  };
};

const resolveOpenAICompatibleConfig = env => {
  if (!env.OPENAI_COMPATIBLE_API_KEY) {
    throw buildConfigError('OpenAI-compatible API key is missing');
  }

  if (!env.OPENAI_COMPATIBLE_BASE_URL) {
    throw buildConfigError('OpenAI-compatible base URL is missing');
  }

  const model = env.OPENAI_COMPATIBLE_MODEL || env.AI_MODEL;

  if (!model) {
    throw buildConfigError('OpenAI-compatible model is missing');
  }

  return {
    provider: 'openai-compatible',
    apiKey: env.OPENAI_COMPATIBLE_API_KEY,
    baseUrl: env.OPENAI_COMPATIBLE_BASE_URL,
    model,
    timeoutMs: parseTimeout(env.AI_TIMEOUT_MS),
  };
};

const resolveAIConfig = (env = process.env) => {
  const provider = env.AI_PROVIDER;

  if (!provider) {
    throw buildConfigError('AI provider is missing');
  }

  if (provider === 'dashscope') {
    const config = resolveDashScopeConfig(env);

    if (!config.model) {
      throw buildConfigError('DashScope model is missing');
    }

    return config;
  }

  if (provider === 'openai-compatible') {
    return resolveOpenAICompatibleConfig(env);
  }

  throw buildConfigError('Unsupported AI provider', 'AI_UNSUPPORTED_PROVIDER');
};

module.exports = {
  DEFAULT_DASHSCOPE_BASE_URL,
  DEFAULT_TIMEOUT_MS,
  loadEnvFiles,
  resolveAIConfig,
  resolveDashScopeConfig,
  resolveOpenAICompatibleConfig,
};
