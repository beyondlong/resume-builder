import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { FormCreator } from '@/components/FormCreator';
import type { ResumeModuleField } from '@/config/types';

jest.mock('@/services/ai/client', () => ({
  improveResumeField: jest.fn(),
}));

import { improveResumeField } from '@/services/ai/client';

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider
      locale="zh-CN"
      messages={{
        AI优化: 'AI优化',
        AI建议: 'AI建议',
        应用此版本: '应用此版本',
        AI暂无可用建议: 'AI暂无可用建议',
        AI请求失败: 'AI请求失败',
        AI服务未配置: 'AI服务未配置，请检查环境变量',
        AI代理不可用: 'AI服务不可用，请检查代理服务是否已启动',
        AI返回结果解析失败: 'AI返回结果解析失败，请稍后重试',
      }}
    >
      {ui}
    </IntlProvider>
  );

describe('FormCreator AI integration', () => {
  const config: ResumeModuleField[] = [
    {
      type: 'textArea',
      attributeId: 'aboutme_desc',
      displayName: '自我介绍',
      ai: {
        enabled: true,
        promptType: 'aboutme',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders AI button for supported fields', () => {
    renderWithIntl(
      <FormCreator
        config={config}
        value={{ aboutme_desc: 'old about me' }}
        onChange={jest.fn()}
        isList={false}
        moduleKey="aboutme"
      />
    );

    expect(screen.getByRole('button', { name: /AI优化/ })).toBeInTheDocument();
  });

  it('applies selected AI candidate to the field', async () => {
    const onChange = jest.fn();
    (improveResumeField as jest.Mock).mockResolvedValue({
      candidates: [{ id: 'candidate-1', content: '优化后的自我介绍' }],
    });

    renderWithIntl(
      <FormCreator
        config={config}
        value={{ aboutme_desc: 'old about me' }}
        onChange={onChange}
        isList={false}
        moduleKey="aboutme"
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /AI优化/ }));

    await waitFor(() => {
      expect(improveResumeField).toHaveBeenCalled();
    });

    expect(await screen.findByText('优化后的自我介绍')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '应用此版本' }));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        aboutme_desc: '优化后的自我介绍',
      });
    });
  });

  it('shows a specific message when AI service is not configured', async () => {
    (improveResumeField as jest.Mock).mockRejectedValue(
      new Error('AI_PROVIDER_NOT_CONFIGURED')
    );

    renderWithIntl(
      <FormCreator
        config={config}
        value={{ aboutme_desc: 'old about me' }}
        onChange={jest.fn()}
        isList={false}
        moduleKey="aboutme"
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /AI优化/ }));

    expect(
      await screen.findAllByText('AI服务未配置，请检查环境变量')
    ).toHaveLength(2);
  });

  it('shows a specific message when AI proxy is unavailable', async () => {
    (improveResumeField as jest.Mock).mockRejectedValue(
      new Error('AI_PROXY_UNAVAILABLE')
    );

    renderWithIntl(
      <FormCreator
        config={config}
        value={{ aboutme_desc: 'old about me' }}
        onChange={jest.fn()}
        isList={false}
        moduleKey="aboutme"
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /AI优化/ }));

    expect(
      await screen.findAllByText('AI服务不可用，请检查代理服务是否已启动')
    ).toHaveLength(2);
  });

  it('updates checkbox fields through checked state', async () => {
    const onChange = jest.fn();

    renderWithIntl(
      <FormCreator
        config={[
          {
            type: 'checkbox',
            attributeId: 'hidden',
            displayName: '隐藏头像',
            formItemProps: {
              valuePropName: 'checked',
            },
          },
        ]}
        value={{ hidden: false }}
        onChange={onChange}
        isList={false}
        moduleKey="avatar"
      />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

    expect(checkbox.checked).toBe(false);

    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ hidden: true });
    });

    await waitFor(() => {
      expect(checkbox.checked).toBe(true);
    });
  });
});
