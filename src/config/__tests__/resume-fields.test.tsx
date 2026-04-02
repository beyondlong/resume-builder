import { getResumeModuleFields } from '@/config/resume-fields';

const intl = {
  formatMessage: ({ id }: { id: string }) => id,
};

describe('resume field config', () => {
  it('marks aboutme_desc as AI-enabled', () => {
    const fields = getResumeModuleFields({ intl });
    const aboutmeDesc = fields.aboutme?.find(
      field => field.attributeId === 'aboutme_desc'
    );

    expect(aboutmeDesc?.ai?.enabled).toBe(true);
    expect(aboutmeDesc?.ai?.promptType).toBe('aboutme');
  });

  it('marks project_content as AI-enabled', () => {
    const fields = getResumeModuleFields({ intl });
    const projectContent = fields.projectList?.find(
      field => field.attributeId === 'project_content'
    );

    expect(projectContent?.ai?.enabled).toBe(true);
    expect(projectContent?.ai?.promptType).toBe('project_content');
  });

  it('marks project_desc as AI-enabled', () => {
    const fields = getResumeModuleFields({ intl });
    const projectDesc = fields.projectList?.find(
      field => field.attributeId === 'project_desc'
    );

    expect(projectDesc?.ai?.enabled).toBe(true);
    expect(projectDesc?.ai?.promptType).toBe('project_desc');
  });

  it('keeps unrelated fields AI-disabled', () => {
    const fields = getResumeModuleFields({ intl });
    const profileName = fields.profile?.find(
      field => field.attributeId === 'name'
    );

    expect(profileName?.ai).toBeUndefined();
  });
});
