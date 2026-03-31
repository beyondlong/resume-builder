import type { ReactNode } from 'react';
import type { FormItemProps } from 'antd/lib/form';
import type { ResumeConfig } from '@/components/types';

export type ResumeModuleKey = keyof ResumeConfig;

export type ResumeModuleField = {
  type: string;
  attributeId: string;
  displayName: string;
  formItemProps?: FormItemProps;
  cfg?: Record<string, any>;
};

export type ResumeModuleDefinition = {
  key: ResumeModuleKey;
  name: string;
  icon: ReactNode;
};
