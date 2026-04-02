import type { ResumeConfig } from '@/components/types';
import {
  applyAIFieldResult,
  isAIImprovementSupported,
} from '@/helpers/resume-ai';

describe('resume-ai helpers', () => {
  it('supports aboutme.aboutme_desc for AI improvement', () => {
    expect(isAIImprovementSupported('aboutme', 'aboutme_desc')).toBe(true);
  });

  it('does not support unrelated profile fields', () => {
    expect(isAIImprovementSupported('profile', 'name')).toBe(false);
  });

  it('supports projectList.project_desc for AI improvement', () => {
    expect(isAIImprovementSupported('projectList', 'project_desc')).toBe(true);
  });

  it('applies AI result to aboutme.aboutme_desc', () => {
    const config: ResumeConfig = {
      aboutme: {
        aboutme_desc: 'old about me',
      },
    };

    const nextConfig = applyAIFieldResult(config, {
      moduleKey: 'aboutme',
      fieldKey: 'aboutme_desc',
      value: 'new about me',
    });

    expect(nextConfig.aboutme?.aboutme_desc).toBe('new about me');
    expect(config.aboutme?.aboutme_desc).toBe('old about me');
  });

  it('applies AI result to a work experience list item', () => {
    const config: ResumeConfig = {
      workExpList: [
        {
          company_name: 'A',
          department_name: 'B',
          work_desc: 'old work desc',
        },
      ],
    };

    const nextConfig = applyAIFieldResult(config, {
      moduleKey: 'workExpList',
      fieldKey: 'work_desc',
      itemIndex: 0,
      value: 'new work desc',
    });

    expect(nextConfig.workExpList?.[0]?.work_desc).toBe('new work desc');
    expect(config.workExpList?.[0]?.work_desc).toBe('old work desc');
  });

  it('applies AI result to a project description item', () => {
    const config: ResumeConfig = {
      projectList: [
        {
          project_name: 'Project A',
          project_role: 'Developer',
          project_desc: 'old project description',
        },
      ],
    };

    const nextConfig = applyAIFieldResult(config, {
      moduleKey: 'projectList',
      fieldKey: 'project_desc',
      itemIndex: 0,
      value: 'new project description',
    });

    expect(nextConfig.projectList?.[0]?.project_desc).toBe(
      'new project description'
    );
    expect(config.projectList?.[0]?.project_desc).toBe(
      'old project description'
    );
  });
});
