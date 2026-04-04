import type { ResumeConfig } from '@/components/types';
import { AIJobRecommendation } from '@/components/AIJobRecommendation';
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
  requestJobRecommendation: jest.fn(() =>
    Promise.resolve({
      summary: '更适合企业服务方向',
      roles: [
        {
          title: '中后台前端工程师',
          score: 88,
          industries: ['企业服务'],
          companyTypes: ['ToB 产品公司'],
          techTags: ['React'],
          reasons: ['项目经历匹配'],
          suggestions: ['补充结果指标'],
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
        AI岗位推荐: 'AI岗位推荐',
        岗位推荐概览: '岗位推荐概览',
        岗位方向: '岗位方向',
        匹配度: '匹配度',
        推荐行业: '推荐行业',
        公司类型: '公司类型',
        技术标签: '技术标签',
        匹配理由: '匹配理由',
        简历建议: '简历建议',
        暂无数据: '暂无数据',
      }}
    >
      {ui}
    </IntlProvider>
  );

describe('AIJobRecommendation', () => {
  it('opens drawer and renders recommendation cards', async () => {
    renderWithIntl(<AIJobRecommendation config={{} as ResumeConfig} />);

    await userEvent.click(screen.getByRole('button', { name: /AI岗位推荐/ }));

    await waitFor(() => {
      expect(screen.getByText('更适合企业服务方向')).toBeInTheDocument();
      expect(screen.getByText('中后台前端工程师')).toBeInTheDocument();
    });
  });
});
