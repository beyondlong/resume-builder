import React from 'react';
import { Template1 } from './Template1';
import { Template2 } from './Template2';
import { Template3 } from './Template3';
import { Template4 } from './Template4';
import { Template5 } from './Template5';
import { Template6 } from './Template6';
import { Template7 } from './Template7';
import type { ResumeConfig, ResumeTemplate, ThemeConfig } from '../types';

type ResumeTemplateComponentProps = {
  value: ResumeConfig;
  theme: ThemeConfig;
};

type ResumeProps = {
  template?: ResumeTemplate;
  value?: ResumeConfig | null;
  theme?: ThemeConfig | null;
};

const TEMPLATE_COMPONENTS: Record<
  ResumeTemplate,
  React.ComponentType<ResumeTemplateComponentProps>
> = {
  template1: Template1,
  template2: Template2,
  template3: Template3,
  template4: Template4,
  template5: Template5,
  template6: Template6,
  template7: Template7,
};

export const Resume: React.FC<ResumeProps> = ({ template, value, theme }) => {
  const selectedTemplate = template || 'template1';
  const Template = TEMPLATE_COMPONENTS[selectedTemplate] || Template1;

  // Guard against invalid or missing value/theme
  if (!value || !theme || typeof value !== 'object') {
    return null;
  }

  return <Template value={value} theme={theme} />;
};
