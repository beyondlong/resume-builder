const {
  resolveAIConfig,
  resolveDashScopeConfig,
  resolveOpenAICompatibleConfig,
} = require('../utils/env');
const {
  buildClientResponse,
  parseCandidatePayload,
} = require('../utils/normalize-response');
const { requestDashScopeCompletion } = require('../providers/dashscope');
const {
  requestOpenAICompatibleCompletion,
} = require('../providers/openai-compatible');
const { requestAICompletion } = require('../providers');

describe('AI provider utilities', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('rejects unsupported provider', () => {
    expect(() => resolveAIConfig({ AI_PROVIDER: 'unknown' })).toThrow(
      'Unsupported AI provider'
    );
  });

  it('resolves DashScope config', () => {
    expect(
      resolveDashScopeConfig({
        DASHSCOPE_API_KEY: 'dash-key',
        AI_MODEL: 'qwen-plus',
      })
    ).toMatchObject({
      provider: 'dashscope',
      apiKey: 'dash-key',
      model: 'qwen-plus',
    });
  });

  it('resolves OpenAI-compatible config with override model', () => {
    expect(
      resolveOpenAICompatibleConfig({
        OPENAI_COMPATIBLE_API_KEY: 'oa-key',
        OPENAI_COMPATIBLE_BASE_URL: 'https://example.com/v1',
        OPENAI_COMPATIBLE_MODEL: 'minimax-text-01',
        AI_MODEL: 'ignored-model',
      })
    ).toMatchObject({
      provider: 'openai-compatible',
      apiKey: 'oa-key',
      model: 'minimax-text-01',
    });
  });

  it('parses candidate JSON content', () => {
    expect(
      parseCandidatePayload('{"candidates":["版本一","","版本二"]}')
    ).toEqual(['版本一', '版本二']);
  });

  it('rejects invalid JSON candidate content', () => {
    expect(() => parseCandidatePayload('not json')).toThrow(
      'AI response is not valid JSON'
    );
  });

  it('builds the client response shape', () => {
    expect(buildClientResponse(['A', 'B'])).toEqual({
      candidates: [
        { id: 'candidate-1', content: 'A' },
        { id: 'candidate-2', content: 'B' },
      ],
    });
  });

  it('builds DashScope native request and returns content', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output: {
          choices: [
            {
              message: {
                content: '{"candidates":["DashScope版本"]}',
              },
            },
          ],
        },
      }),
    });

    const content = await requestDashScopeCompletion(
      {
        provider: 'dashscope',
        apiKey: 'dash-key',
        baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
        model: 'qwen-plus',
      },
      'prompt text',
      fetchImpl
    );

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer dash-key',
        }),
      })
    );
    expect(content).toBe('{"candidates":["DashScope版本"]}');
  });

  it('builds OpenAI-compatible request and returns content', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: '{"candidates":["兼容接口版本"]}',
            },
          },
        ],
      }),
    });

    const content = await requestOpenAICompatibleCompletion(
      {
        provider: 'openai-compatible',
        apiKey: 'oa-key',
        baseUrl: 'https://example.com/v1',
        model: 'gpt-like-model',
      },
      'prompt text',
      fetchImpl
    );

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://example.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer oa-key',
        }),
      })
    );
    expect(content).toBe('{"candidates":["兼容接口版本"]}');
  });

  it('routes requests through provider router', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: '{"candidates":["路由结果"]}',
            },
          },
        ],
      }),
    });

    const result = await requestAICompletion(
      {
        provider: 'openai-compatible',
        apiKey: 'oa-key',
        baseUrl: 'https://example.com/v1',
        model: 'demo-model',
      },
      'prompt text',
      fetchImpl
    );

    expect(result).toBe('{"candidates":["路由结果"]}');
  });
});
