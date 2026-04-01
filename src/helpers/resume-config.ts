import _ from 'lodash-es';
import type { ResumeConfig } from '@/components/types';
import { customAssign } from '@/helpers/customAssign';
import { loadFromStorage } from '@/helpers/storage';
import { normalizeThemeConfig } from '@/helpers/theme';
import staticResumeData from '../../static/resume.json';

export const getDefaultResumeConfig = (): ResumeConfig =>
  staticResumeData as ResumeConfig;

export const resolveLocalizedResumeConfig = (
  config: ResumeConfig,
  lang: string
): ResumeConfig => {
  const resolvedConfig = _.omit(
    customAssign({}, config, _.get(config, ['locales', lang]) || {}),
    ['locales']
  ) as ResumeConfig;

  return {
    ...resolvedConfig,
    theme: normalizeThemeConfig(resolvedConfig.theme),
  };
};

export const loadPersistedResumeConfig = (): ResumeConfig => {
  const config = loadFromStorage() || getDefaultResumeConfig();

  return {
    ...config,
    theme: normalizeThemeConfig(config.theme),
  } as ResumeConfig;
};

export const loadResolvedResumeConfig = (lang: string): ResumeConfig =>
  resolveLocalizedResumeConfig(loadPersistedResumeConfig(), lang);
