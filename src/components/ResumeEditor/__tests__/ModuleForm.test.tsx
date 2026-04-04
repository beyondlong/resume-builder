import type { ResumeConfig } from '@/components/types';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import zhCNMessages from '@/i18n/locales/zh-CN.json';
import { ModuleForm } from '../ModuleForm';

jest.mock('@/components/FormCreator', () => ({
  FormCreator: ({ moduleKey, value }) => (
    <div data-testid="mock-form-creator">
      {moduleKey}:{JSON.stringify(value)}
    </div>
  ),
}));

describe('ModuleForm list state', () => {
  it('resets editing state when switching between list modules', () => {
    const config = {
      awardList: [
        {
          award_time: '2021.01',
          award_info: '优秀员工',
        },
      ],
      projectList: [
        {
          project_time: '2022.01-2022.12',
          project_name: 'Resume Builder',
          project_role: 'PM',
          project_desc: 'desc',
          project_content: 'content',
        },
      ],
    } as ResumeConfig;

    const view = render(
      <IntlProvider locale="zh-CN" messages={zhCNMessages}>
        <ModuleForm
          moduleKey="awardList"
          config={config}
          onChange={jest.fn()}
        />
      </IntlProvider>
    );

    fireEvent.click(screen.getByText('1. 优秀员工'));
    fireEvent.click(screen.getByRole('button', { name: /编辑/ }));

    expect(screen.getByTestId('mock-form-creator')).toHaveTextContent(
      'awardList'
    );

    view.rerender(
      <IntlProvider locale="zh-CN" messages={zhCNMessages}>
        <ModuleForm
          moduleKey="projectList"
          config={config}
          onChange={jest.fn()}
        />
      </IntlProvider>
    );

    expect(screen.queryByTestId('mock-form-creator')).not.toBeInTheDocument();
    expect(screen.getByText('1. Resume Builder')).toBeInTheDocument();
  });
});
