import React from 'react';
import { Tag } from 'antd';
import {
  MobileFilled,
  MailFilled,
  GithubFilled,
  ZhihuCircleFilled,
  ScheduleFilled,
  EnvironmentFilled,
  HeartFilled,
} from '@ant-design/icons';
import _ from 'lodash-es';
import { FormattedMessage, useIntl } from 'react-intl';
import { getDefaultTitleNameMap } from '@/data/constant';
import { Avatar } from '../../Avatar';
import type { ResumeConfig, ThemeConfig } from '../../types';
import './index.less';

type Props = {
  value: ResumeConfig;
  theme: ThemeConfig;
};

/**
 * @description 模板4 - 现代简洁风格
 * 单栏布局，顶部姓名+联系方式横排，内容垂直排列
 */
export const Template4: React.FC<Props> = props => {
  const intl = useIntl();
  const { value, theme } = props;

  const profile = _.get(value, 'profile');
  const titleNameMap = _.get(value, 'titleNameMap', getDefaultTitleNameMap({ intl }));
  const educationList = _.get(value, 'educationList');
  const workExpList = _.get(value, 'workExpList');
  const projectList = _.get(value, 'projectList');
  const skillList = _.get(value, 'skillList');
  const awardList = _.get(value, 'awardList');
  const aboutme = _.split(_.get(value, ['aboutme', 'aboutme_desc']), '\n');

  return (
    <div className="template4-resume resume-content">
      {/* 头部区域 */}
      <div className="resume-header" style={{ borderBottomColor: theme.color }}>
        {/* 姓名 */}
        <h1 className="name" style={{ color: theme.color }}>{profile?.name}</h1>

        {/* 联系方式横排 */}
        <div className="contact-row">
          {profile?.mobile && (
            <span className="contact-item">
              <MobileFilled style={{ color: theme.color }} />
              {profile.mobile}
            </span>
          )}
          {profile?.email && (
            <span className="contact-item">
              <MailFilled style={{ color: theme.color }} />
              {profile.email}
            </span>
          )}
          {profile?.github && (
            <span className="contact-item link" onClick={() => window.open(profile.github)}>
              <GithubFilled style={{ color: theme.color }} />
              GitHub
            </span>
          )}
          {profile?.zhihu && (
            <span className="contact-item link" onClick={() => window.open(profile.zhihu)}>
              <ZhihuCircleFilled style={{ color: theme.color }} />
              知乎
            </span>
          )}
          {profile?.workExpYear && (
            <span className="contact-item">
              <ScheduleFilled style={{ color: theme.color }} />
              {profile.workExpYear}
            </span>
          )}
          {profile?.workPlace && (
            <span className="contact-item">
              <EnvironmentFilled style={{ color: theme.color }} />
              {profile.workPlace}
            </span>
          )}
          {profile?.positionTitle && (
            <span className="contact-item">
              <HeartFilled style={{ color: theme.color }} />
              {profile.positionTitle}
            </span>
          )}
        </div>
      </div>

      {/* 主体内容 */}
      <div className="resume-body">
        {/* 工作经历 */}
        {workExpList?.length ? (
          <section className="section">
            <h2 className="section-title" style={{ color: theme.color }}>
              {titleNameMap?.workExpList}
            </h2>
            <div className="section-content">
              {workExpList.map((work, idx) => {
                const workTime = work.work_time || [];
                const [start, end] = Array.isArray(workTime) ? workTime : [null, null];
                return work ? (
                  <div className="item" key={idx}>
                    <div className="item-header">
                      <span className="company">{work.company_name}</span>
                      {work.department_name && <span className="department">{work.department_name}</span>}
                      <span className="time">
                        {start} {end ? `~ ${end}` : '~ 至今'}
                      </span>
                    </div>
                    <div className="item-desc">{work.work_desc}</div>
                  </div>
                ) : null;
              })}
            </div>
          </section>
        ) : null}

        {/* 项目经验 */}
        {projectList?.length ? (
          <section className="section">
            <h2 className="section-title" style={{ color: theme.color }}>
              {titleNameMap?.projectList}
            </h2>
            <div className="section-content">
              {projectList.map((project, idx) =>
                project ? (
                  <div className="item" key={idx}>
                    <div className="item-header">
                      <span className="project-name">{project.project_name}</span>
                      {project.project_time && <span className="time">{project.project_time}</span>}
                      {project.project_role && (
                        <Tag color={theme.tagColor} className="role-tag">{project.project_role}</Tag>
                      )}
                    </div>
                    <div className="item-desc">
                      {project.project_desc && <span className="desc-label">项目描述：</span>}
                      <span>{project.project_desc}</span>
                    </div>
                    {project.project_content && (
                      <div className="item-content">
                        <span className="desc-label">主要工作：</span>
                        <span>{project.project_content}</span>
                      </div>
                    )}
                  </div>
                ) : null
              )}
            </div>
          </section>
        ) : null}

        {/* 教育背景 */}
        {educationList?.length ? (
          <section className="section">
            <h2 className="section-title" style={{ color: theme.color }}>
              {titleNameMap?.educationList}
            </h2>
            <div className="section-content">
              {educationList.map((edu, idx) => {
                const eduTime = edu.edu_time || [];
                const [start, end] = Array.isArray(eduTime) ? eduTime : [undefined, undefined];
                return (
                  <div className="item edu-item" key={idx}>
                    <span className="school">{edu.school}</span>
                    <span className="major">
                      {edu.major} {edu.academic_degree && `(${edu.academic_degree})`}
                    </span>
                    <span className="time">
                      {start} {end ? `~ ${end}` : '~ 至今'}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* 技能证书 */}
        {(skillList?.length || awardList?.length) ? (
          <section className="section">
            <h2 className="section-title" style={{ color: theme.color }}>
              {titleNameMap?.skillList}
            </h2>
            <div className="section-content">
              {skillList?.length ? skillList.map((skill, idx) =>
                skill ? (
                  <div className="skill-item" key={idx}>
                    {skill.skill_name && <span className="skill-name">{skill.skill_name}: </span>}
                    <span className="skill-desc">{skill.skill_desc}</span>
                  </div>
                ) : null
              ) : null}
              {awardList?.length ? awardList.map((award, idx) =>
                award ? (
                  <div className="award-item" key={idx}>
                    <span className="award-info">{award.award_info}</span>
                    {award.award_time && <span className="award-time">({award.award_time})</span>}
                  </div>
                ) : null
              ) : null}
            </div>
          </section>
        ) : null}

        {/* 自我介绍 */}
        {aboutme && aboutme.length > 0 && _.trim(aboutme.join('')) ? (
          <section className="section">
            <h2 className="section-title" style={{ color: theme.color }}>
              <FormattedMessage id="自我介绍" />
            </h2>
            <div className="section-content about-content">
              {aboutme.map((d, idx) => d ? <p key={idx}>{d}</p> : null)}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};
