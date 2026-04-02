import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Template3 } from '@/components/Resume/Template3';
import zhCNMessages from '@/i18n/locales/zh-CN.json';

describe('Template3 avatar rendering', () => {
  it('renders avatar when avatar is configured and not hidden', () => {
    const { container } = render(
      <IntlProvider locale="zh-CN" messages={zhCNMessages}>
        <Template3
          value={{
            avatar: {
              src: 'https://example.com/avatar.png',
              hidden: false,
              shape: 'circle',
              size: 'default',
            },
            profile: {
              name: 'Test User',
            },
          }}
          theme={{
            color: '#2f5785',
            tagColor: '#8bc34a',
          }}
        />
      </IntlProvider>
    );

    expect(container.querySelector('.avatar')).toBeTruthy();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});
