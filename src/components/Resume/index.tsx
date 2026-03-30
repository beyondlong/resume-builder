import React from 'react';
import { Template1 } from './Template1';
import { Template2 } from './Template2';
import { Template3 } from './Template3';
import { Template4 } from './Template4';
import { Template5 } from './Template5';

export const Resume: React.FC<any> = ({ template, value, theme, ...restProps }) => {
  // Guard against invalid or missing value/theme
  if (!value || !theme || typeof value !== 'object') {
    return null;
  }

  const Template = React.useMemo(() => {
    switch (template) {
      case 'template2':
        return Template2;
      case 'template3':
        return Template3;
      case 'template4':
        return Template4;
      case 'template5':
        return Template5;
      default:
        return Template1;
    }
  }, [template]);

  return Template ? <Template value={value} theme={theme} {...restProps} /> : null;
};
