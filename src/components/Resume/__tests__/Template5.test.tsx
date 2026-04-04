import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Template5 } from '@/components/Resume/Template5';
import zhCNMessages from '@/i18n/locales/zh-CN.json';

describe('Template5 layout', () => {
  it('renders formal header and document-style content layout', () => {
    const { container } = render(
      <IntlProvider locale="zh-CN" messages={zhCNMessages}>
        <Template5
          value={{
            avatar: {
              src: 'https://example.com/avatar.png',
              hidden: false,
              shape: 'circle',
              size: 'default',
            },
            profile: {
              name: 'Test User',
              positionTitle: '技术经理',
              mobile: '13800000000',
              email: 'test@example.com',
              workExpYear: '10年经验',
              workPlace: '上海',
            },
            aboutme: {
              aboutme_desc: '具备完整的企业级系统建设经验',
            },
            skillList: [
              {
                skill_name: '管理协同',
                skill_desc: '跨团队推进、交付管理、项目治理',
              },
            ],
            awardList: [
              {
                award_time: '2024',
                award_info: '年度优秀管理者',
              },
            ],
            workExpList: [
              {
                company_name: '某科技公司',
                department_name: '技术中心',
                work_time: ['2019.01', '2024.01'],
                work_desc: '负责研发团队管理和核心项目推进',
              },
            ],
            projectList: [
              {
                project_name: '中台治理项目',
                project_role: '负责人',
                project_time: '2022.01-2023.12',
                project_desc: '推动组织级平台治理升级',
                project_content: '负责规划、协调、落地与复盘',
              },
            ],
            educationList: [
              {
                school: '复旦大学',
                major: '软件工程',
                academic_degree: '硕士',
                edu_time: ['2010.09', '2013.06'],
              },
            ],
          }}
          theme={{
            color: '#1f3c88',
            tagColor: '#8bc34a',
          }}
        />
      </IntlProvider>
    );

    expect(container.querySelector('.resume-topbar')).toBeTruthy();
    expect(container.querySelector('.resume-column-layout')).toBeTruthy();
    expect(container.querySelector('.resume-sidebar')).toBeTruthy();
    expect(container.querySelector('.resume-main')).toBeTruthy();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getAllByText('技术经理').length).toBeGreaterThan(0);
    expect(screen.getByText('中台治理项目')).toBeInTheDocument();
    expect(screen.getByText('年度优秀管理者')).toBeInTheDocument();
  });
});
