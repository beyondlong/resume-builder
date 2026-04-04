import { requestJobRecommendation } from '@/services/ai/job-recommendation';

const originalEnv = process.env;
const originalFetch = global.fetch;
const originalWindow = global.window;

describe('requestJobRecommendation', () => {
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

  it('uses the local proxy endpoint by default', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        summary: '适合中后台方向',
        roles: [],
      }),
    });

    await requestJobRecommendation({
      resume: {
        language: 'zh-CN',
        profile: {},
        summary: '',
        education: [],
        workExperience: [],
        projects: [],
        skills: [],
      },
      language: 'zh-CN',
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8787/api/ai/job-recommendation',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('returns structured recommendation data', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        summary: '适合企业服务方向',
        roles: [
          {
            title: '前端工程师',
            score: 88,
            industries: ['企业服务'],
            companyTypes: ['ToB 产品公司'],
            techTags: ['React'],
            reasons: ['项目经历匹配'],
            suggestions: ['补充结果指标'],
          },
        ],
      }),
    });

    const result = await requestJobRecommendation({
      resume: {
        language: 'zh-CN',
        profile: {},
        summary: '',
        education: [],
        workExperience: [],
        projects: [],
        skills: [],
      },
      language: 'zh-CN',
    });

    expect(result.summary).toBe('适合企业服务方向');
    expect(result.roles[0].title).toBe('前端工程师');
  });

  it('throws structured proxy errors', async () => {
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
      requestJobRecommendation({
        resume: {
          language: 'zh-CN',
          profile: {},
          summary: '',
          education: [],
          workExperience: [],
          projects: [],
          skills: [],
        },
        language: 'zh-CN',
      })
    ).rejects.toMatchObject({
      name: 'AI_PROVIDER_NOT_CONFIGURED',
      message: 'AI provider is not configured',
    });
  });
});
