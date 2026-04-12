export const AI_ERROR_MESSAGE_IDS: Record<string, string> = {
  AI_PROXY_UNAVAILABLE: 'AI代理不可用',
  AI_PROVIDER_NOT_CONFIGURED: 'AI服务未配置',
  AI_INVALID_RESPONSE: 'AI返回结果解析失败',
  AI_UPSTREAM_REQUEST_FAILED: 'AI请求失败',
  AI_REQUEST_FAILED: 'AI请求失败',
};

export const resolveAIErrorMessage = (
  error: unknown,
  formatMessage: (id: string) => string
): string => {
  if (error instanceof Error) {
    const messageId =
      AI_ERROR_MESSAGE_IDS[error.name] || AI_ERROR_MESSAGE_IDS[error.message];

    return messageId ? formatMessage(messageId) : error.message;
  }

  return formatMessage('AI请求失败');
};
