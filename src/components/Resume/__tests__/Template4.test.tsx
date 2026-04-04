import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Template4 } from '@/components/Resume/Template4';
import zhCNMessages from '@/i18n/locales/zh-CN.json';

describe('Template4 layout', () => {
  it('renders avatar and modern single-column content layout', () => {
    const { container } = render(
      <IntlProvider locale="zh-CN" messages={zhCNMessages}>
        <Template4
          value={{
            avatar: {
              src: 'https://example.com/avatar.png',
              hidden: false,
              shape: 'circle',
              size: 'default',
            },
            profile: {
              name: 'Test User',
              positionTitle: '高级前端工程师',
              mobile: '13800000000',
              email: 'test@example.com',
              workExpYear: '8年经验',
              workPlace: '上海',
            },
            aboutme: {
              aboutme_desc: '负责企业级系统建设\n擅长复杂后台产品设计',
            },
            skillList: [
              {
                skill_name: 'React',
                skill_desc: '组件化、工程化、性能优化',
              },
            ],
            awardList: [
              {
                award_time: '2023',
                award_info: '优秀员工',
              },
            ],
            workList: [
              {
                work_name: '作品集',
                visit_link: 'https://example.com',
                work_desc: '项目合集',
              },
            ],
            workExpList: [
              {
                company_name: '某科技公司',
                department_name: '平台研发部',
                work_time: ['2020.01', '2024.01'],
                work_desc: '负责中后台系统设计与交付',
              },
            ],
            projectList: [
              {
                project_name: '经营分析平台',
                project_role: '项目负责人',
                project_time: '2023.01-2023.12',
                project_desc: '面向运营团队的数据分析平台',
                project_content: '负责需求梳理、架构设计与核心模块实现',
              },
            ],
            educationList: [
              {
                school: '交通大学',
                major: '计算机科学',
                academic_degree: '本科',
                edu_time: ['2012.09', '2016.06'],
              },
            ],
          }}
          theme={{
            color: '#2f5785',
            tagColor: '#8bc34a',
          }}
        />
      </IntlProvider>
    );

    expect(container.querySelector('.avatar')).toBeTruthy();
    expect(container.querySelector('.resume-flow')).toBeTruthy();
    expect(container.querySelector('.resume-utility-grid')).toBeTruthy();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getAllByText('高级前端工程师').length).toBeGreaterThan(0);
    expect(screen.getByText('作品集')).toBeInTheDocument();
    expect(screen.getByText('经营分析平台')).toBeInTheDocument();
  });
});
