import { getSearchObj } from '@/helpers/location';

/**
 * 获取语言
 */
export function getLanguage(): string {
  const query = getSearchObj();
  // 始终使用 en-US，因为 locale 文件中已包含中文翻译
  const lang = (query.lang as string) || 'zh-CN';
  typeof document !== 'undefined' && document.body.setAttribute('lang', lang);
  return lang;
}
