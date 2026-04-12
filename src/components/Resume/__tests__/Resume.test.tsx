import { Resume } from '@/components/Resume';
import zhCNMessages from '@/i18n/locales/zh-CN.json';
import { render } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

const baseValue = {
  profile: {
    name: 'Test User',
  },
};

const baseTheme = {
  color: '#2f5785',
  tagColor: '#2f5785',
};

describe('Resume', () => {
  it('returns nothing when value or theme is missing', () => {
    const withoutValue = render(
      <IntlProvider locale="zh-CN" messages={zhCNMessages}>
        <Resume theme={baseTheme} />
      </IntlProvider>
    );

    expect(withoutValue.container.firstChild).toBeNull();

    const withoutTheme = render(
      <IntlProvider locale="zh-CN" messages={zhCNMessages}>
        <Resume value={baseValue} />
      </IntlProvider>
    );

    expect(withoutTheme.container.firstChild).toBeNull();
  });

  it('falls back to template1 when template is missing or unknown', () => {
    const withoutTemplate = render(
      <IntlProvider locale="zh-CN" messages={zhCNMessages}>
        <Resume value={baseValue} theme={baseTheme} />
      </IntlProvider>
    );

    expect(
      withoutTemplate.container.querySelector('.template1-resume')
    ).toBeTruthy();

    const unknownTemplate = render(
      <IntlProvider locale="zh-CN" messages={zhCNMessages}>
        <Resume
          value={baseValue}
          theme={baseTheme}
          template={'unknown-template' as never}
        />
      </IntlProvider>
    );

    expect(
      unknownTemplate.container.querySelector('.template1-resume')
    ).toBeTruthy();
  });

  it('renders the requested resume template', () => {
    const { container } = render(
      <IntlProvider locale="zh-CN" messages={zhCNMessages}>
        <Resume value={baseValue} theme={baseTheme} template="template4" />
      </IntlProvider>
    );

    expect(container.querySelector('.template4-resume')).toBeTruthy();
  });
});
