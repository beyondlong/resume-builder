import type { ResumeModuleField, ResumeModuleKey } from '@/config/types';
import type { AIImproveRequest } from '@/services/ai/types';

export const isAIField = (field: ResumeModuleField): boolean =>
  Boolean(field.ai?.enabled);

export const buildAIRequestFromField = ({
  field,
  moduleKey,
  itemIndex,
  sourceText,
  language,
}: {
  field: ResumeModuleField;
  moduleKey: ResumeModuleKey;
  itemIndex?: number;
  sourceText: string;
  language: 'zh-CN' | 'en-US';
}): AIImproveRequest => {
  return {
    target: {
      moduleKey,
      fieldKey: field.attributeId,
      itemIndex,
    },
    sourceText,
    language,
  };
};
