import React from 'react';
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
import { Avatar } from '../../Avatar';
import type { ResumeConfig, ThemeConfig } from '../../types';
import { getResumeViewModel } from '../shared';
import { openExternalLink } from '../link-utils';
import {
  AboutMeItems,
  ModernEducationItems,
  ModernProjectItems,
  ModernSkillAwardItems,
  ModernWorkExperienceItems,
} from '../shared-sections';
import { ModernSection } from '../shared-layouts';
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
  const {
    profile,
    titleNameMap,
    educationList,
    workExpList,
    projectList,
    skillList,
    awardList,
    aboutmeList,
    presentLabel,
  } = getResumeViewModel(value, intl);

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
              <div
                className="contact-item link"
                onClick={() => openExternalLink(profile.github)}
              >
                <GithubFilled />
                <span>GitHub</span>
              </div>
            )}
            {profile?.zhihu && (
              <div
                className="contact-item link"
                onClick={() => openExternalLink(profile.zhihu)}
              >
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
        {skillList?.length || awardList?.length ? (
          <div className="skills-section">
            <h3 className="section-label">{titleNameMap?.skillList}</h3>
            <div className="skills-list">
              <ModernSkillAwardItems
                skillList={skillList}
                awardList={awardList}
              />
            </div>
          </div>
        ) : null}

        {/* 自我介绍 */}
        {aboutmeList &&
        aboutmeList.length > 0 &&
        _.trim(aboutmeList.join('')) ? (
          <div className="about-section">
            <h3 className="section-label">自我介绍</h3>
            <div className="about-content">
              <AboutMeItems aboutmeList={aboutmeList} paragraphTag="p" />
            </div>
          </div>
        ) : null}
      </div>

      {/* 右侧主内容 */}
      <div className="main-content">
        {/* 工作经历 */}
        {workExpList?.length ? (
          <ModernSection
            title={titleNameMap?.workExpList}
            color={theme.color}
            contentClassName="section-body"
          >
            <ModernWorkExperienceItems
              workExpList={workExpList}
              presentLabel={presentLabel}
            />
          </ModernSection>
        ) : null}

        {/* 项目经验 */}
        {projectList?.length ? (
          <ModernSection
            title={titleNameMap?.projectList}
            color={theme.color}
            contentClassName="section-body"
          >
            <ModernProjectItems projectList={projectList} theme={theme} />
          </ModernSection>
        ) : null}

        {/* 教育背景 */}
        {educationList?.length ? (
          <ModernSection
            title={titleNameMap?.educationList}
            color={theme.color}
            contentClassName="section-body"
          >
            <ModernEducationItems
              educationList={educationList}
              presentLabel={presentLabel}
            />
          </ModernSection>
        ) : null}
      </div>
    </div>
  );
};
