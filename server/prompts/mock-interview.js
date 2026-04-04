const buildMockInterviewPrompt = (resume, language = 'zh-CN') => {
  if (language === 'zh-CN') {
    return [
      '你是一位资深面试官和技术招聘经理。',
      '请严格基于候选人当前简历内容生成模拟面试题。',
      '不要输出泛泛的通用题库，不要脱离简历编造问题背景。',
      '问题应优先围绕项目经历、工作经历、技术栈和自我介绍生成。',
      '请输出严格 JSON。',
      '返回格式必须为：',
      '{"summary":"", "questions":[{"question":"","intent":"","answerGuidance":[],"resumeEvidence":""}]}',
      '请生成 6 道题。',
      '简历摘要：',
      JSON.stringify(resume, null, 2),
    ].join('\n');
  }

  return [
    'You are a senior interviewer and technical hiring manager.',
    'Generate mock interview questions strictly based on the current resume content.',
    'Do not output generic interview dumps and do not invent unsupported background.',
    'Prioritize project experience, work experience, skills, and summary.',
    'Return strict JSON only.',
    'Required shape:',
    '{"summary":"", "questions":[{"question":"","intent":"","answerGuidance":[],"resumeEvidence":""}]}',
    'Generate 6 questions.',
    'Resume context:',
    JSON.stringify(resume, null, 2),
  ].join('\n');
};

module.exports = {
  buildMockInterviewPrompt,
};
