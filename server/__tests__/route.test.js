const { handleAIImproveRequest } = require('../routes/ai');
const { CORS_HEADERS } = require('../index');

describe('AI improve route', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns bad request when prompt is missing', async () => {
    const result = await handleAIImproveRequest({});

    expect(result).toEqual({
      statusCode: 400,
      payload: {
        error: {
          code: 'AI_BAD_REQUEST',
          message: 'Prompt is required for AI improvement',
        },
      },
    });
  });

  it('returns provider config error when env is missing', async () => {
    const result = await handleAIImproveRequest(
      { prompt: 'test prompt' },
      { env: {} }
    );

    expect(result.statusCode).toBe(500);
    expect(result.payload.error.code).toBe('AI_PROVIDER_NOT_CONFIGURED');
  });

  it('returns normalized candidates when provider succeeds', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output: {
          choices: [
            {
              message: {
                content: '{"candidates":["优化结果一","优化结果二"]}',
              },
            },
          ],
        },
      }),
    });

    const result = await handleAIImproveRequest(
      { prompt: 'test prompt' },
      {
        env: {
          AI_PROVIDER: 'dashscope',
          DASHSCOPE_API_KEY: 'dash-key',
          AI_MODEL: 'qwen-plus',
        },
        fetchImpl,
      }
    );

    expect(result).toEqual({
      statusCode: 200,
      payload: {
        candidates: [
          { id: 'candidate-1', content: '优化结果一' },
          { id: 'candidate-2', content: '优化结果二' },
        ],
      },
    });
  });

  it('returns invalid response error for non-JSON model output', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output: {
          choices: [
            {
              message: {
                content: 'not-json',
              },
            },
          ],
        },
      }),
    });

    const result = await handleAIImproveRequest(
      { prompt: 'test prompt' },
      {
        env: {
          AI_PROVIDER: 'dashscope',
          DASHSCOPE_API_KEY: 'dash-key',
          AI_MODEL: 'qwen-plus',
        },
        fetchImpl,
      }
    );

    expect(result.statusCode).toBe(502);
    expect(result.payload.error.code).toBe('AI_INVALID_RESPONSE');
  });

  it('returns upstream provider error detail for failed requests', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        code: 'InvalidParameter',
        message: 'response_format is invalid',
      }),
    });

    const result = await handleAIImproveRequest(
      { prompt: 'test prompt' },
      {
        env: {
          AI_PROVIDER: 'dashscope',
          DASHSCOPE_API_KEY: 'dash-key',
          AI_MODEL: 'qwen-plus',
        },
        fetchImpl,
      }
    );

    expect(result).toEqual({
      statusCode: 502,
      payload: {
        error: {
          code: 'AI_UPSTREAM_REQUEST_FAILED',
          message: 'DashScope request failed: response_format is invalid',
        },
      },
    });
  });

  it('exposes shared CORS headers for cross-origin local development', () => {
    expect(CORS_HEADERS).toEqual({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
  });
});
