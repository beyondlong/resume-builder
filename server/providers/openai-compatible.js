const stripTrailingSlash = value => value.replace(/\/+$/, '');

const requestOpenAICompatibleCompletion = async (
  config,
  prompt,
  fetchImpl = fetch
) => {
  const url = `${stripTrailingSlash(config.baseUrl)}/chat/completions`;

  const response = await fetchImpl(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = new Error('OpenAI-compatible request failed');
    error.code = 'AI_UPSTREAM_REQUEST_FAILED';
    throw error;
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
};

module.exports = {
  requestOpenAICompatibleCompletion,
};
