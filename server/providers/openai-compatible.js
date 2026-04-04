const stripTrailingSlash = value => value.replace(/\/+$/, '');

const buildUpstreamError = async response => {
  let detail = `OpenAI-compatible request failed with status ${response.status}`;

  try {
    const payload = await response.json();
    const message =
      payload?.error?.message ||
      payload?.message ||
      payload?.error?.code ||
      payload?.code;

    if (message) {
      detail = `OpenAI-compatible request failed: ${message}`;
    }
  } catch (_error) {
    try {
      const text = await response.text();

      if (text && text.trim()) {
        detail = `OpenAI-compatible request failed: ${text.trim()}`;
      }
    } catch (_textError) {
      // ignore secondary parse failures and keep the fallback detail
    }
  }

  const error = new Error(detail);
  error.code = 'AI_UPSTREAM_REQUEST_FAILED';
  return error;
};

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
    throw await buildUpstreamError(response);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
};

module.exports = {
  requestOpenAICompatibleCompletion,
};
