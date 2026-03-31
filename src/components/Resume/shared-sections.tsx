import React from 'react';
import { Tag } from 'antd';
import { FormattedMessage } from 'react-intl';
import { formatDateRange } from '@/helpers/resume-dates';
import type { ResumeConfig, ThemeConfig } from '../types';

type EducationItem = NonNullable<ResumeConfig['educationList']>[number];
type WorkExpItem = NonNullable<ResumeConfig['workExpList']>[number];
type ProjectItem = NonNullable<ResumeConfig['projectList']>[number];

export const ClassicEducationItems: React.FC<{
  educationList: EducationItem[];
  presentLabel: string;
}> = ({ educationList, presentLabel }) => (
  <>
    {educationList.map((education, idx) => {
      const eduTimeLabel = formatDateRange(education.edu_time, presentLabel);

      return (
        <div key={idx.toString()} className="education-item">
          <div>
            <span>
              <b>{education.school}</b>
              <span style={{ marginLeft: '8px' }}>
                {education.major && <span>{education.major}</span>}
                {education.academic_degree && (
                  <span className="sub-info" style={{ marginLeft: '4px' }}>
                    ({education.academic_degree})
                  </span>
                )}
              </span>
            </span>
            <span className="sub-info" style={{ float: 'right' }}>
              {eduTimeLabel}
            </span>
          </div>
        </div>
      );
    })}
  </>
);

export const ClassicWorkExperienceItems: React.FC<{
  workExpList: WorkExpItem[];
  presentLabel: string;
}> = ({ workExpList, presentLabel }) => (
  <>
    {workExpList.map((work, idx) => {
      const workTimeLabel = formatDateRange(work.work_time, presentLabel);

      return work ? (
        <div className="section-item" key={idx.toString()}>
          <div className="section-info">
            <b className="info-name">
              {work.company_name}
              <span className="sub-info">{work.department_name}</span>
            </b>
            <span className="info-time">{workTimeLabel}</span>
          </div>
          <div className="work-description">{work.work_desc}</div>
        </div>
      ) : null;
    })}
  </>
);

export const ClassicProjectItems: React.FC<{
  projectList: ProjectItem[];
  theme: ThemeConfig;
}> = ({ projectList, theme }) => (
  <>
    {projectList.map((project, idx) =>
      project ? (
        <div className="section-item" key={idx.toString()}>
          <div className="section-info">
            <b className="info-name">
              {project.project_name}
              <span className="info-time">{project.project_time}</span>
            </b>
            {project.project_role && (
              <Tag color={theme.tagColor}>{project.project_role}</Tag>
            )}
          </div>
          <div className="section-detail">
            <span>
              <FormattedMessage id="项目描述" />：
            </span>
            <span>{project.project_desc}</span>
          </div>
          <div className="section-detail">
            <span>
              <FormattedMessage id="主要工作" />：
            </span>
            <span className="project-content">{project.project_content}</span>
          </div>
        </div>
      ) : null
    )}
  </>
);

export const ModernWorkExperienceItems: React.FC<{
  workExpList: WorkExpItem[];
  presentLabel: string;
}> = ({ workExpList, presentLabel }) => (
  <>
    {workExpList.map((work, idx) => {
      const workTimeLabel = formatDateRange(work.work_time, presentLabel);

      return work ? (
        <div className="item" key={idx}>
          <div className="item-header">
            <span className="company">{work.company_name}</span>
            {work.department_name && (
              <span className="department">{work.department_name}</span>
            )}
            <span className="time">{workTimeLabel}</span>
          </div>
          <div className="item-desc">{work.work_desc}</div>
        </div>
      ) : null;
    })}
  </>
);

export const ModernProjectItems: React.FC<{
  projectList: ProjectItem[];
  theme: ThemeConfig;
}> = ({ projectList, theme }) => (
  <>
    {projectList.map((project, idx) =>
      project ? (
        <div className="item" key={idx}>
          <div className="item-header">
            <span className="project-name">{project.project_name}</span>
            {project.project_time && (
              <span className="time">{project.project_time}</span>
            )}
            {project.project_role && (
              <Tag color={theme.tagColor} className="role-tag">
                {project.project_role}
              </Tag>
            )}
          </div>
          <div className="item-desc">
            {project.project_desc && (
              <>
                <span className="label">项目描述：</span>
                <span>{project.project_desc}</span>
              </>
            )}
          </div>
          {project.project_content && (
            <div className="item-content">
              <span className="label">主要工作：</span>
              <span>{project.project_content}</span>
            </div>
          )}
        </div>
      ) : null
    )}
  </>
);

export const ModernEducationItems: React.FC<{
  educationList: EducationItem[];
  presentLabel: string;
}> = ({ educationList, presentLabel }) => (
  <>
    {educationList.map((edu, idx) => {
      const eduTimeLabel = formatDateRange(edu.edu_time, presentLabel);

      return (
        <div className="item edu-item" key={idx}>
          <span className="school">{edu.school}</span>
          <span className="major">
            {edu.major} {edu.academic_degree && `(${edu.academic_degree})`}
          </span>
          <span className="time">{eduTimeLabel}</span>
        </div>
      );
    })}
  </>
);

export const AboutMeItems: React.FC<{
  aboutmeList: string[];
  paragraphTag?: 'div' | 'p';
}> = ({ aboutmeList, paragraphTag = 'div' }) => (
  <>
    {aboutmeList.map((item, idx) =>
      item ? React.createElement(paragraphTag, { key: idx }, item) : null
    )}
  </>
);

export const PortfolioItems: React.FC<{
  workList: NonNullable<ResumeConfig['workList']>;
}> = ({ workList }) => (
  <>
    {workList.map((work, idx) => (
      <div key={idx.toString()}>
        <div>
          <b className="info-name">{work.work_name}</b>
          <a className="sub-info" href={work.visit_link}>
            <FormattedMessage id="访问链接" />
          </a>
        </div>
        {work.work_desc && <div>{work.work_desc}</div>}
      </div>
    ))}
  </>
);

export const ClassicSkillItems: React.FC<{
  skillList: NonNullable<ResumeConfig['skillList']>;
}> = ({ skillList }) => (
  <>
    {skillList.map((skill, idx) =>
      skill ? (
        <React.Fragment key={idx.toString()}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '8px',
            }}
          >
            <b className="info-name">{skill.skill_name}</b>
            <span className="skill-rate">
              {skill.skill_level ? `${skill.skill_level}%` : ''}
            </span>
          </div>
          {String(skill.skill_desc || '')
            .split('\n')
            .map((item, detailIdx) =>
              item ? (
                <div className="skill-detail-item" key={detailIdx}>
                  {item}
                </div>
              ) : null
            )}
        </React.Fragment>
      ) : null
    )}
  </>
);

export const ClassicAwardItems: React.FC<{
  awardList: NonNullable<ResumeConfig['awardList']>;
}> = ({ awardList }) => (
  <>
    {awardList.map((award, idx) => (
      <div key={idx.toString()}>
        <b className="info-name">{award.award_info}</b>
        {award.award_time && (
          <span className="sub-info award-time">({award.award_time})</span>
        )}
      </div>
    ))}
  </>
);

export const ModernSkillAwardItems: React.FC<{
  skillList?: ResumeConfig['skillList'];
  awardList?: ResumeConfig['awardList'];
}> = ({ skillList, awardList }) => (
  <>
    {skillList?.length
      ? skillList.map((skill, idx) =>
          skill ? (
            <div className="skill-item" key={idx}>
              {skill.skill_name && (
                <span className="skill-name">{skill.skill_name}: </span>
              )}
              <span className="skill-desc">{skill.skill_desc}</span>
            </div>
          ) : null
        )
      : null}
    {awardList?.length
      ? awardList.map((award, idx) =>
          award ? (
            <div className="award-item" key={idx}>
              <span className="award-info">{award.award_info}</span>
              {award.award_time && (
                <span className="award-time">({award.award_time})</span>
              )}
            </div>
          ) : null
        )
      : null}
  </>
);
