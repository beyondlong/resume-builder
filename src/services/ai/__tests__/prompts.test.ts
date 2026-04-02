import { buildResumeImprovePrompt } from '@/services/ai/prompts';

describe('buildResumeImprovePrompt', () => {
  it('builds a hiring-manager-oriented Chinese prompt based on existing content', () => {
    const prompt = buildResumeImprovePrompt({
      target: {
        moduleKey: 'aboutme',
        fieldKey: 'aboutme_desc',
      },
      sourceText: '5年前端开发经验，负责企业后台系统建设',
      language: 'zh-CN',
    });

    expect(prompt).toContain('你是一位资深人力资源专家和招聘经理');
    expect(prompt).toContain('你必须严格保留原文事实和真实含义。');
    expect(prompt).toContain('字段：aboutme_desc');
    expect(prompt).toContain(
      '重点突出职业定位、经验年限、擅长领域和清晰可感知的职业价值。'
    );
    expect(prompt).toContain('原始内容：');
    expect(prompt).toContain('5年前端开发经验，负责企业后台系统建设');
  });

  it('uses field-specific Chinese guidance for project content', () => {
    const prompt = buildResumeImprovePrompt({
      target: {
        moduleKey: 'projectList',
        fieldKey: 'project_content',
      },
      sourceText: '负责前端开发和联调',
      language: 'zh-CN',
    });

    expect(prompt).toContain(
      '重点突出职责分工、关键动作、主导内容、协作方式和原文中已体现的结果，不得虚构成果。'
    );
  });

  it('falls back to english prompt for english content', () => {
    const prompt = buildResumeImprovePrompt({
      target: {
        moduleKey: 'projectList',
        fieldKey: 'project_desc',
      },
      sourceText: 'Built a payment dashboard for merchant operations.',
      language: 'en-US',
    });

    expect(prompt).toContain(
      'You are a senior HR expert and hiring manager who specializes in improving resume writing.'
    );
    expect(prompt).toContain('Field: project_desc');
  });
});
