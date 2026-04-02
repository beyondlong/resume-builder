import type { ResumeConfig } from '@/components/types';
import type { ResumeModuleKey } from '@/config/types';
import type { AIImproveTarget } from '@/services/ai/types';

const AI_ENABLED_FIELDS: Partial<Record<ResumeModuleKey, string[]>> = {
  aboutme: ['aboutme_desc'],
  projectList: ['project_content', 'project_desc'],
  workExpList: ['work_desc'],
};

export const isAIImprovementSupported = (
  moduleKey: ResumeModuleKey,
  fieldKey: string
): boolean => {
  return AI_ENABLED_FIELDS[moduleKey]?.includes(fieldKey) ?? false;
};

export const applyAIFieldResult = (
  config: ResumeConfig,
  target: AIImproveTarget
): ResumeConfig => {
  const { moduleKey, fieldKey, itemIndex, value = '' } = target;

  if (!isAIImprovementSupported(moduleKey, fieldKey)) {
    return config;
  }

  if (moduleKey === 'aboutme') {
    return {
      ...config,
      aboutme: {
        ...(config.aboutme || { aboutme_desc: '' }),
        [fieldKey]: value,
      },
    };
  }

  if (moduleKey === 'workExpList' || moduleKey === 'projectList') {
    if (typeof itemIndex !== 'number') {
      return config;
    }

    const list = [...(config[moduleKey] || [])];
    const currentItem = list[itemIndex];

    if (!currentItem) {
      return config;
    }

    list[itemIndex] = {
      ...currentItem,
      [fieldKey]: value,
    };

    return {
      ...config,
      [moduleKey]: list,
    };
  }

  return config;
};
