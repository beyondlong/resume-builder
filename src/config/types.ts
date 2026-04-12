import type { ReactNode } from 'react';
import type { FormItemProps } from 'antd/lib/form';
import type { MessageDescriptor } from 'react-intl';
import type { ResumeConfig } from '@/components/types';

export type ResumeModuleKey = keyof ResumeConfig;

export type ResumeIntlShape = {
  formatMessage: (
    descriptor: MessageDescriptor,
    values?: Record<string, unknown>
  ) => string;
};

export type ResumeModuleField = {
  type: string;
  attributeId: string;
  displayName: string;
  formItemProps?: FormItemProps;
  cfg?: Record<string, unknown>;
  ai?: {
    enabled: boolean;
    promptType: 'aboutme' | 'project_content' | 'project_desc' | 'work_desc';
  };
};

export type ResumeModuleDefinition = {
  key: ResumeModuleKey;
  name: string;
  icon: ReactNode;
};
