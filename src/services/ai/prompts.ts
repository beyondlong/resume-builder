import type { AIImproveRequest } from './types';

const FIELD_GUIDANCE: Record<string, string> = {
  aboutme_desc:
    'Focus on career positioning, years of experience, domain strengths, and clearly expressed professional value.',
  project_desc:
    'Focus on project background, business purpose, target users, and overall project value.',
  project_content:
    'Focus on responsibilities, concrete actions, ownership, methods, collaboration, and outcomes without inventing results.',
  work_desc:
    'Focus on job responsibilities, core abilities, delivery contribution, and concise resume-ready wording.',
};

const FIELD_GUIDANCE_ZH: Record<string, string> = {
  aboutme_desc: '重点突出职业定位、经验年限、擅长领域和清晰可感知的职业价值。',
  project_desc: '重点突出项目背景、业务目标、服务对象和项目整体价值。',
  project_content:
    '重点突出职责分工、关键动作、主导内容、协作方式和原文中已体现的结果，不得虚构成果。',
  work_desc:
    '重点突出岗位职责、核心能力、交付贡献，并用更适合简历投递的语言表达。',
};

export const buildResumeImprovePrompt = (request: AIImproveRequest): string => {
  const language = request.language || 'zh-CN';
  const isChinese =
    language.toLowerCase().startsWith('zh') ||
    /[\u4e00-\u9fa5]/.test(request.sourceText);

  if (isChinese) {
    const fieldGuidance =
      FIELD_GUIDANCE_ZH[request.target.fieldKey] ||
      '重点让原文表达更清晰、更专业、更符合简历筛选场景。';

    return [
      '你是一位资深人力资源专家和招聘经理，擅长优化候选人的简历表达。',
      '你的任务是基于候选人已经提供的原始内容做专业、克制、真实的简历优化，而不是重写经历。',
      '你必须严格保留原文事实和真实含义。',
      '不得虚构、夸大、补充原文没有提到的经历、成果、数据或职责。',
      '输出风格要像真实用于投递的简历内容，而不是宣传文案或广告语。',
      '如果原文已经不错，只做有限优化，不要过度改写。',
      `语言：${language}`,
      `字段：${request.target.fieldKey}`,
      `优化重点：${fieldGuidance}`,
      '优化要求：',
      '1. 严格基于原文优化，只能调整表达方式。',
      '2. 提升专业度、清晰度、条理性和简历可读性。',
      '3. 在原文事实支持的前提下，突出职责、能力、价值和结果导向。',
      '4. 去掉口语化、重复、空泛、低信息量的表达。',
      '5. 保持内容可信、简洁，符合 HR 筛选简历时的阅读习惯。',
      '原始内容：',
      request.sourceText,
      '请返回合法 JSON，格式必须为：{"candidates":["优化版本1","优化版本2"]}',
      '在可能的情况下返回 2 个候选版本。',
    ].join('\n');
  }

  const fieldGuidance =
    FIELD_GUIDANCE[request.target.fieldKey] ||
    'Focus on making the content clearer, more professional, and more suitable for resume screening.';

  return [
    'You are a senior HR expert and hiring manager who specializes in improving resume writing.',
    'Your task is to optimize the existing resume content, not to rewrite the candidate experience from scratch.',
    'You must strictly preserve the original facts and meaning.',
    'Do not invent, exaggerate, add metrics, or introduce experience that is not present in the source text.',
    'Write in a style that looks like a real resume submitted for hiring review, not marketing copy.',
    'If the source text is already acceptable, only make restrained improvements.',
    `Language: ${language}`,
    `Field: ${request.target.fieldKey}`,
    `Optimization focus: ${fieldGuidance}`,
    'Optimization rules:',
    '1. Base the optimization only on the existing source text.',
    '2. Improve clarity, professionalism, and resume-readiness.',
    '3. Highlight responsibility, capability, value, and result orientation where already supported by the source text.',
    '4. Remove vague, repetitive, spoken, or low-information wording.',
    '5. Keep the output concise, credible, and suitable for HR screening.',
    'Source text:',
    request.sourceText,
    'Return valid JSON in this shape: {"candidates":["text 1","text 2"]}',
    'Return 2 candidate versions when possible.',
  ].join('\n');
};
