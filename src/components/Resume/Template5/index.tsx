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
  TrophyFilled,
  CheckCircleFilled,
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
 * @description 模板5 - 经典商务风格
 * 左侧深色栏（个人信息），右侧浅色栏（工作经历等）
 */
export const Template5: React.FC<Props> = props => {
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
    <div className="template5-resume resume-content">
      {/* 左侧栏 */}
      <div className="sidebar" style={{ background: theme.color }}>
        {/* 头像 */}
        {!value?.avatar?.hidden && (
          <Avatar
            avatarSrc={value?.avatar?.src}
            className="avatar"
            shape={value?.avatar?.shape}
            size={value?.avatar?.size}
          />
        )}

        {/* 姓名 */}
        <h1 className="name">{profile?.name}</h1>

        {/* 联系方式 */}
        <div className="contact-section">
          <h3 className="section-label">联系方式</h3>
          <div className="contact-list">
            {profile?.mobile && (
              <div className="contact-item">
                <MobileFilled />
                <span>{profile.mobile}</span>
              </div>
            )}
            {profile?.email && (
              <div className="contact-item">
                <MailFilled />
                <span>{profile.email}</span>
              </div>
            )}
            {profile?.github && (
              <div className="contact-item link" onClick={() => window.open(profile.github)}>
                <GithubFilled />
                <span>GitHub</span>
              </div>
            )}
            {profile?.zhihu && (
              <div className="contact-item link" onClick={() => window.open(profile.zhihu)}>
                <ZhihuCircleFilled />
                <span>知乎</span>
              </div>
            )}
            {profile?.workExpYear && (
              <div className="contact-item">
                <ScheduleFilled />
                <span>经验 {profile.workExpYear}</span>
              </div>
            )}
            {profile?.workPlace && (
              <div className="contact-item">
                <EnvironmentFilled />
                <span>{profile.workPlace}</span>
              </div>
            )}
            {profile?.positionTitle && (
              <div className="contact-item">
                <HeartFilled />
                <span>{profile.positionTitle}</span>
              </div>
            )}
          </div>
        </div>

        {/* 技能证书 */}
        {(skillList?.length || awardList?.length) ? (
          <div className="skills-section">
            <h3 className="section-label">{titleNameMap?.skillList}</h3>
            <div className="skills-list">
              {skillList?.length ? skillList.map((skill, idx) =>
                skill ? (
                  <div className="skill-item" key={idx}>
                    {skill.skill_name && <span className="skill-name">{skill.skill_name}</span>}
                    {skill.skill_desc && <p className="skill-desc">{skill.skill_desc}</p>}
                  </div>
                ) : null
              ) : null}
              {awardList?.length ? awardList.map((award, idx) =>
                award ? (
                  <div className="award-item" key={idx}>
                    <TrophyFilled style={{ color: '#ffd700' }} />
                    <span>{award.award_info}</span>
                    {award.award_time && <span className="time">({award.award_time})</span>}
                  </div>
                ) : null
              ) : null}
            </div>
          </div>
        ) : null}

        {/* 自我介绍 */}
        {aboutme && aboutme.length > 0 && _.trim(aboutme.join('')) ? (
          <div className="about-section">
            <h3 className="section-label">自我介绍</h3>
            <div className="about-content">
              {aboutme.map((d, idx) => d ? <p key={idx}>{d}</p> : null)}
            </div>
          </div>
        ) : null}
      </div>

      {/* 右侧主内容 */}
      <div className="main-content">
        {/* 工作经历 */}
        {workExpList?.length ? (
          <section className="section">
            <h2 className="section-title" style={{ color: theme.color }}>
              {titleNameMap?.workExpList}
            </h2>
            <div className="section-body">
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
            <div className="section-body">
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
            </div>
          </section>
        ) : null}

        {/* 教育背景 */}
        {educationList?.length ? (
          <section className="section">
            <h2 className="section-title" style={{ color: theme.color }}>
              {titleNameMap?.educationList}
            </h2>
            <div className="section-body">
              {educationList.map((edu, idx) => {
                const eduTime = edu.edu_time || [];
                const [start, end] = Array.isArray(eduTime) ? eduTime : [undefined, undefined];
                return (
                  <div className="edu-item" key={idx}>
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
      </div>
    </div>
  );
};
