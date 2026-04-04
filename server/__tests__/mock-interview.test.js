const {
  handleMockInterviewRequest,
} = require('../routes/mock-interview');
const {
  buildMockInterviewPrompt,
} = require('../prompts/mock-interview');

describe('mock interview prompt and route', () => {
  it('builds a resume-based interview prompt', () => {
    const prompt = buildMockInterviewPrompt(
      { summary: '前端开发', projects: [{ name: '管理平台' }] },
      'zh-CN'
    );

    expect(prompt).toContain('资深面试官');
    expect(prompt).toContain('严格基于候选人当前简历内容');
    expect(prompt).toContain('"questions"');
    expect(prompt).toContain('不要输出泛泛的通用题库');
  });

  it('returns bad request when resume context is missing', async () => {
    const result = await handleMockInterviewRequest({});

    expect(result).toEqual({
      statusCode: 400,
      payload: {
        error: {
          code: 'AI_BAD_REQUEST',
          message: 'Resume context is required for mock interview',
        },
      },
    });
  });

  it('returns normalized interview questions when provider succeeds', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output: {
          choices: [
            {
              message: {
                content:
                  '{"summary":"重点围绕项目和工作经历提问","questions":[{"question":"介绍一下你的核心项目","intent":"考察项目深度","answerGuidance":["先讲背景","再讲职责"],"resumeEvidence":"负责企业后台系统建设"}]}',
              },
            },
          ],
        },
      }),
    });

    const result = await handleMockInterviewRequest(
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
        summary: '重点围绕项目和工作经历提问',
        questions: [
          {
            question: '介绍一下你的核心项目',
            intent: '考察项目深度',
            answerGuidance: ['先讲背景', '再讲职责'],
            resumeEvidence: '负责企业后台系统建设',
          },
        ],
      },
    });
  });

  it('returns invalid response for malformed question payload', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output: {
          choices: [
            {
              message: {
                content: '{"summary":"x","items":[]}',
              },
            },
          ],
        },
      }),
    });

    const result = await handleMockInterviewRequest(
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
