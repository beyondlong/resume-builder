import type { ResumeConfig } from '@/components/types';
import type { ResumeAILanguage, ResumeAIContext } from './types';

const cleanString = (value?: string | null): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized || undefined;
};

const joinDateRange = (
  value?: [
    string | number | null | undefined,
    string | number | null | undefined
  ]
): string | undefined => {
  if (!value) {
    return undefined;
  }

  const normalized = value
    .map(item => (item == null ? '' : String(item).trim()))
    .filter(Boolean);

  return normalized.length ? normalized.join(' - ') : undefined;
};

const compactObject = <T extends Record<string, unknown>>(
  value: T
): Partial<T> =>
  Object.fromEntries(
    Object.entries(value).filter(([, item]) => {
      if (item == null) {
        return false;
      }

      if (typeof item === 'string') {
        return item.trim().length > 0;
      }

      if (Array.isArray(item)) {
        return item.length > 0;
      }

      return true;
    })
  ) as Partial<T>;

const extractSkills = (resume: ResumeConfig): string[] =>
  (resume.skillList || [])
    .map(skill => cleanString(skill.skill_name))
    .filter((value): value is string => Boolean(value));

const extractProjects = (resume: ResumeConfig) =>
  (resume.projectList || []).map(project =>
    compactObject({
      name: cleanString(project.project_name),
      description: cleanString(project.project_desc),
      responsibilities: cleanString(project.project_content),
      techHints: [],
    })
  );

const extractWorkExperience = (resume: ResumeConfig) =>
  (resume.workExpList || []).map(work =>
    compactObject({
      company: cleanString(work.company_name),
      role: cleanString(work.department_name),
      time: joinDateRange(work.work_time),
      description: cleanString(work.work_desc),
    })
  );

const extractEducation = (resume: ResumeConfig) =>
  (resume.educationList || []).map(education =>
    compactObject({
      school: cleanString(education.school),
      major: cleanString(education.major),
      degree: cleanString(education.academic_degree),
      time: joinDateRange(education.edu_time),
    })
  );

export const buildResumeAIContext = (
  resume: ResumeConfig,
  language: ResumeAILanguage
): ResumeAIContext => {
  return {
    language,
    profile: compactObject({
      name: cleanString(resume.profile?.name),
      city: cleanString(resume.profile?.workPlace),
      yearsOfExperienceHint: cleanString(resume.profile?.workExpYear),
      currentTitle: cleanString(resume.profile?.positionTitle),
    }),
    summary: cleanString(resume.aboutme?.aboutme_desc) || '',
    education: extractEducation(resume),
    workExperience: extractWorkExperience(resume),
    projects: extractProjects(resume),
    skills: extractSkills(resume),
  };
};
