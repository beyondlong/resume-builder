import Header from '@/layout/header';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';

const navigate = jest.fn();

jest.mock('gatsby', () => ({
  navigate: (...args) => navigate(...args),
}));

jest.mock('@/components/LangSwitcher', () => ({
  LangSwitcher: () => <div data-testid="lang-switcher" />,
}));

describe('Header', () => {
  beforeEach(() => {
    navigate.mockReset();
    window.history.replaceState({}, '', '/?lang=en-US');
  });

  it('renders localized title and preview button in English', () => {
    render(
      <IntlProvider
        locale="en-US"
        messages={{
          简历编辑器: 'Resume Editor',
          预览: 'Preview',
          导入配置: 'Import Config',
          上传配置已应用: 'Upload config applied',
          '上传文件有误，请重新上传': 'Invalid file',
          '编辑模式下, 切换国际化会导致正在配置的内容丢失，请及时保存':
            'Switching language in edit mode will lose unsaved changes.',
        }}
      >
        <Header onImport={jest.fn()} />
      </IntlProvider>
    );

    expect(screen.getByText('Resume Editor')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Preview/ })).toBeInTheDocument();
  });

  it('preserves lang when navigating to preview', async () => {
    render(
      <IntlProvider
        locale="en-US"
        messages={{
          简历编辑器: 'Resume Editor',
          预览: 'Preview',
          导入配置: 'Import Config',
          上传配置已应用: 'Upload config applied',
          '上传文件有误，请重新上传': 'Invalid file',
          '编辑模式下, 切换国际化会导致正在配置的内容丢失，请及时保存':
            'Switching language in edit mode will lose unsaved changes.',
        }}
      >
        <Header onImport={jest.fn()} />
      </IntlProvider>
    );

    await userEvent.click(screen.getByRole('button', { name: /Preview/ }));

    expect(navigate).toHaveBeenCalledWith(
      '/preview?lang=en-US&template=template4'
    );
  });
});
