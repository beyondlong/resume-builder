import { RESUME_INFO } from '@/data/resume';
import { buildResumeAIContext } from '@/services/ai/resume-context';

describe('buildResumeAIContext', () => {
  it('builds a compact resume context for AI analysis', () => {
    const context = buildResumeAIContext(RESUME_INFO, 'zh-CN');

    expect(context).toMatchObject({
      language: 'zh-CN',
      profile: {
        name: '姓名',
        city: '浙江杭州',
        currentTitle: '前端工程师',
      },
      summary: expect.any(String),
      education: expect.any(Array),
      workExperience: expect.any(Array),
      projects: expect.any(Array),
      skills: expect.any(Array),
    });

    expect(context.summary).toContain('Focus on data visualization');
    expect(context.workExperience[0]).toMatchObject({
      company: '蚂蚁集团',
      role: '体验技术部',
    });
    expect(context.projects[0]).toMatchObject({
      name: '数据作战室',
      description: expect.any(String),
      responsibilities: expect.any(String),
    });
    expect(context.skills).toContain('React / 前端工程化');
  });

  it('filters empty values and keeps language passthrough', () => {
    const context = buildResumeAIContext(
      {
        profile: {
          name: 'Test User',
          workPlace: '',
          positionTitle: 'Engineer',
        },
        aboutme: {
          aboutme_desc: '',
        },
        skillList: [
          {
            skill_name: 'TypeScript',
          },
          {
            skill_name: '',
          },
        ],
        educationList: [],
        workExpList: [],
        projectList: [],
      },
      'en-US'
    );

    expect(context).toEqual({
      language: 'en-US',
      profile: {
        name: 'Test User',
        currentTitle: 'Engineer',
      },
      summary: '',
      education: [],
      workExperience: [],
      projects: [],
      skills: ['TypeScript'],
    });
  });
});
