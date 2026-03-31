import _ from 'lodash-es';
import type { ResumeConfig } from '@/components/types';
import { customAssign } from '@/helpers/customAssign';
import { loadFromStorage } from '@/helpers/storage';
import staticResumeData from '../../static/resume.json';

export const getDefaultResumeConfig = (): ResumeConfig =>
  staticResumeData as ResumeConfig;

export const resolveLocalizedResumeConfig = (
  config: ResumeConfig,
  lang: string
): ResumeConfig => {
  return _.omit(
    customAssign({}, config, _.get(config, ['locales', lang]) || {}),
    ['locales']
  ) as ResumeConfig;
};

export const loadPersistedResumeConfig = (): ResumeConfig =>
  loadFromStorage() || getDefaultResumeConfig();

export const loadResolvedResumeConfig = (lang: string): ResumeConfig =>
  resolveLocalizedResumeConfig(loadPersistedResumeConfig(), lang);
