const buildJobRecommendationPrompt = (
  resume,
  language = 'zh-CN'
) => {
  if (language === 'zh-CN') {
    return [
      '你是一位资深招聘经理和技术招聘顾问。',
      '请基于候选人的简历内容，分析其更适合投递的岗位方向、行业方向、公司类型和技术标签匹配点。',
      '不要推荐具体公司名称，不要编造不存在的经历或能力。',
      '请输出严格 JSON。',
      '返回格式必须为：',
      '{"summary":"", "roles":[{"title":"","score":0,"industries":[],"companyTypes":[],"techTags":[],"reasons":[],"suggestions":[]}]}',
      '分值范围为 0 到 100。',
      '请推荐 3 个最适合的岗位方向。',
      '简历摘要：',
      JSON.stringify(resume, null, 2),
    ].join('\n');
  }

  return [
    'You are a senior recruiter and technical hiring advisor.',
    'Analyze the resume and recommend suitable role directions, industry directions, company types, and matching tech tags.',
    'Do not recommend specific company names and do not invent experience.',
    'Return strict JSON only.',
    'Required shape:',
    '{"summary":"", "roles":[{"title":"","score":0,"industries":[],"companyTypes":[],"techTags":[],"reasons":[],"suggestions":[]}]}',
    'Score must be between 0 and 100.',
    'Recommend the 3 most suitable role directions.',
    'Resume context:',
    JSON.stringify(resume, null, 2),
  ].join('\n');
};

module.exports = {
  buildJobRecommendationPrompt,
};
