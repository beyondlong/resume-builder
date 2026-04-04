import type { ResumeConfig } from '@/components/types';
import { AIMockInterview } from '@/components/AIMockInterview';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';

jest.mock('@/services/ai', () => ({
  buildResumeAIContext: jest.fn(() => ({
    language: 'zh-CN',
    profile: {},
    summary: '',
    education: [],
    workExperience: [],
    projects: [],
    skills: [],
  })),
  requestMockInterview: jest.fn(() =>
    Promise.resolve({
      summary: '重点围绕项目和工作经历提问',
      questions: [
        {
          question: '介绍一下你的核心项目',
          intent: '考察项目深度',
          answerGuidance: ['先讲背景', '再讲职责'],
          resumeEvidence: '负责企业后台系统建设',
        },
      ],
    })
  ),
}));

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider
      locale="zh-CN"
      messages={{
        AI模拟面试: 'AI模拟面试',
        模拟面试概览: '模拟面试概览',
        简历模拟问题: '简历模拟问题',
        提问意图: '提问意图',
        回答思路: '回答思路',
        简历依据: '简历依据',
        暂无数据: '暂无数据',
      }}
    >
      {ui}
    </IntlProvider>
  );

describe('AIMockInterview', () => {
  it('opens drawer and renders interview questions', async () => {
    renderWithIntl(<AIMockInterview config={{} as ResumeConfig} />);

    await userEvent.click(screen.getByRole('button', { name: /AI模拟面试/ }));

    await waitFor(() => {
      expect(
        screen.getByText('重点围绕项目和工作经历提问')
      ).toBeInTheDocument();
      expect(screen.getByText('介绍一下你的核心项目')).toBeInTheDocument();
    });
  });
});
