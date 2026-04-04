const {
  handleJobRecommendationRequest,
} = require('../routes/job-recommendation');
const {
  buildJobRecommendationPrompt,
} = require('../prompts/job-recommendation');

describe('job recommendation prompt and route', () => {
  it('builds a recruiter-oriented prompt with structured output rules', () => {
    const prompt = buildJobRecommendationPrompt(
      { summary: '前端开发', skills: ['React'] },
      'zh-CN'
    );

    expect(prompt).toContain('资深招聘经理');
    expect(prompt).toContain('不要推荐具体公司名称');
    expect(prompt).toContain('"roles"');
    expect(prompt).toContain('行业方向');
  });

  it('returns bad request when resume context is missing', async () => {
    const result = await handleJobRecommendationRequest({});

    expect(result).toEqual({
      statusCode: 400,
      payload: {
        error: {
          code: 'AI_BAD_REQUEST',
          message: 'Resume context is required for job recommendation',
        },
      },
    });
  });

  it('returns normalized recommendation data when provider succeeds', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output: {
          choices: [
            {
              message: {
                content:
                  '{"summary":"适合中后台方向","roles":[{"title":"中后台前端工程师","score":88,"industries":["企业服务"],"companyTypes":["ToB 产品公司"],"techTags":["React"],"reasons":["项目经验匹配"],"suggestions":["补充结果指标"]}]}',
              },
            },
          ],
        },
      }),
    });

    const result = await handleJobRecommendationRequest(
      { resume: { summary: 'test' }, language: 'zh-CN' },
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
        summary: '适合中后台方向',
        roles: [
          {
            title: '中后台前端工程师',
            score: 88,
            industries: ['企业服务'],
            companyTypes: ['ToB 产品公司'],
            techTags: ['React'],
            reasons: ['项目经验匹配'],
            suggestions: ['补充结果指标'],
          },
        ],
      },
    });
  });

  it('returns invalid response for malformed role payload', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output: {
          choices: [
            {
              message: {
                content: '{"summary":"x","list":[]}',
              },
            },
          ],
        },
      }),
    });

    const result = await handleJobRecommendationRequest(
      { resume: { summary: 'test' } },
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
});
