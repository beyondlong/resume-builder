const stripTrailingSlash = value => value.replace(/\/+$/, '');

const requestDashScopeCompletion = async (
  config,
  prompt,
  fetchImpl = fetch
) => {
  const url = `${stripTrailingSlash(
    config.baseUrl
  )}/services/aigc/text-generation/generation`;

  const response = await fetchImpl(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      input: {
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      parameters: {
        temperature: 0.7,
        result_format: 'message',
        response_format: {
          type: 'json_object',
        },
      },
    }),
  });

  if (!response.ok) {
    const error = new Error('DashScope request failed');
    error.code = 'AI_UPSTREAM_REQUEST_FAILED';
    throw error;
  }

  const data = await response.json();
  return data?.output?.choices?.[0]?.message?.content || '';
};

module.exports = {
  requestDashScopeCompletion,
};
