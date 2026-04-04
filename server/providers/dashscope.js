const stripTrailingSlash = value => value.replace(/\/+$/, '');

const buildUpstreamError = async response => {
  let detail = `DashScope request failed with status ${response.status}`;

  try {
    const payload = await response.json();
    const message =
      payload?.message ||
      payload?.error?.message ||
      payload?.code ||
      payload?.request_id;

    if (message) {
      detail = `DashScope request failed: ${message}`;
    }
  } catch (_error) {
    try {
      const text = await response.text();

      if (text && text.trim()) {
        detail = `DashScope request failed: ${text.trim()}`;
      }
    } catch (_textError) {
      // ignore secondary parse failures and keep the fallback detail
    }
  }

  const error = new Error(detail);
  error.code = 'AI_UPSTREAM_REQUEST_FAILED';
  return error;
};

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
    throw await buildUpstreamError(response);
  }

  const data = await response.json();
  return data?.output?.choices?.[0]?.message?.content || '';
};

module.exports = {
  requestDashScopeCompletion,
};
