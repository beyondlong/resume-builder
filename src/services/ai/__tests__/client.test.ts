import { improveResumeField } from '@/services/ai/client';

const originalEnv = process.env;
const originalFetch = global.fetch;
const originalWindow = global.window;

describe('AI client', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.GATSBY_AI_API_BASE_URL;
    global.fetch = jest.fn();
    Object.defineProperty(global, 'window', {
      configurable: true,
      value: {
        location: {
          hostname: 'localhost',
        },
      },
    });
  });

  afterAll(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    Object.defineProperty(global, 'window', {
      configurable: true,
      value: originalWindow,
    });
  });

  it('uses the local proxy URL by default in local development', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ id: 'candidate-1', content: '版本一' }],
      }),
    });

    await improveResumeField({
      target: {
        moduleKey: 'aboutme',
        fieldKey: 'aboutme_desc',
      },
      sourceText: 'old about me',
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8787/api/ai/improve',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('uses the configured proxy base URL when provided', async () => {
    process.env.GATSBY_AI_API_BASE_URL = 'https://demo.example.com';

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ id: 'candidate-1', content: '版本一' }],
      }),
    });

    await improveResumeField({
      target: {
        moduleKey: 'aboutme',
        fieldKey: 'aboutme_desc',
      },
      sourceText: 'old about me',
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://demo.example.com/api/ai/improve',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('throws a friendly error when proxy is unavailable', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network error'));

    await expect(
      improveResumeField({
        target: {
          moduleKey: 'aboutme',
          fieldKey: 'aboutme_desc',
        },
        sourceText: 'old about me',
      })
    ).rejects.toThrow('AI_PROXY_UNAVAILABLE');
  });

  it('returns candidates from the AI proxy response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          { id: 'candidate-1', content: '版本一' },
          { id: 'candidate-2', content: '版本二' },
        ],
      }),
    });

    const response = await improveResumeField({
      target: {
        moduleKey: 'aboutme',
        fieldKey: 'aboutme_desc',
      },
      sourceText: 'old about me',
      language: 'zh-CN',
    });

    expect(response.candidates).toEqual([
      { id: 'candidate-1', content: '版本一' },
      { id: 'candidate-2', content: '版本二' },
    ]);
  });

  it('throws provider configuration errors from the proxy', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({
        error: {
          code: 'AI_PROVIDER_NOT_CONFIGURED',
          message: 'AI provider is not configured',
        },
      }),
    });

    await expect(
      improveResumeField({
        target: {
          moduleKey: 'aboutme',
          fieldKey: 'aboutme_desc',
        },
        sourceText: 'old about me',
      })
    ).rejects.toThrow('AI_PROVIDER_NOT_CONFIGURED');
  });
});
