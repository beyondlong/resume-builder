import { requestMockInterview } from '@/services/ai/mock-interview';

const originalEnv = process.env;
const originalFetch = global.fetch;
const originalWindow = global.window;

describe('requestMockInterview', () => {
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
        summary: '围绕项目和工作经历提问',
        questions: [],
      }),
    });

    await requestMockInterview({
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
      'http://localhost:8787/api/ai/mock-interview',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('returns structured interview question data', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        summary: '围绕项目和工作经历提问',
        questions: [
          {
            question: '介绍一下你的核心项目',
            intent: '考察项目深度',
            answerGuidance: ['先讲背景', '再讲职责'],
            resumeEvidence: '负责企业后台系统建设',
          },
        ],
      }),
    });

    const result = await requestMockInterview({
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

    expect(result.summary).toBe('围绕项目和工作经历提问');
    expect(result.questions[0].question).toBe('介绍一下你的核心项目');
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
      requestMockInterview({
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
