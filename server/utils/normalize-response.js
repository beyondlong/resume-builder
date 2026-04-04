const stripJsonFence = content => {
  if (typeof content !== 'string') {
    return '';
  }

  return content
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
};

const parseStructuredPayload = content => {
  const normalizedContent = stripJsonFence(content);

  if (!normalizedContent) {
    const error = new Error('AI response content is empty');
    error.code = 'AI_INVALID_RESPONSE';
    throw error;
  }

  try {
    return JSON.parse(normalizedContent);
  } catch (_error) {
    const error = new Error('AI response is not valid JSON');
    error.code = 'AI_INVALID_RESPONSE';
    throw error;
  }
};

const parseCandidatePayload = content => {
  const parsed = parseStructuredPayload(content);

  if (!Array.isArray(parsed?.candidates)) {
    const error = new Error('AI response does not contain candidates');
    error.code = 'AI_INVALID_RESPONSE';
    throw error;
  }

  return parsed.candidates
    .filter(item => typeof item === 'string')
    .map(item => item.trim())
    .filter(Boolean);
};

const buildClientResponse = rawCandidates => ({
  candidates: rawCandidates.map((content, index) => ({
    id: `candidate-${index + 1}`,
    content,
  })),
});

module.exports = {
  buildClientResponse,
  parseStructuredPayload,
  parseCandidatePayload,
};
