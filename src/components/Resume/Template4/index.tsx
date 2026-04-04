import React from 'react';
import {
  GithubFilled,
  MailFilled,
  MobileFilled,
  ZhihuCircleFilled,
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
  PortfolioItems,
} from '../shared-sections';
import { ModernSection } from '../shared-layouts';
import './index.less';

type Props = {
  value: ResumeConfig;
  theme: ThemeConfig;
};

export const Template4: React.FC<Props> = ({ value, theme }) => {
  const intl = useIntl();
  const themedIconStyle = { color: theme.color };
  const {
    profile,
    titleNameMap,
    educationList,
    workExpList,
    projectList,
    skillList,
    awardList,
    workList,
    aboutmeList,
    presentLabel,
  } = getResumeViewModel(value, intl);

  return (
    <div className="template4-resume resume-content">
      <div className="resume-header" style={{ borderBottomColor: theme.color }}>
        <div className="resume-header-top">
          <div className="resume-header-main">
            {!value?.avatar?.hidden && (
              <Avatar
                avatarSrc={value?.avatar?.src}
                className="avatar"
                shape={value?.avatar?.shape}
                size={value?.avatar?.size}
              />
            )}
            <div className="identity-block">
              <h1 className="name" style={{ color: theme.color }}>
                {profile?.name}
              </h1>
              {profile?.positionTitle ? (
                <div className="position-title">{profile.positionTitle}</div>
              ) : null}
            </div>
          </div>

          <div className="contact-panel">
            {profile?.mobile ? (
              <span className="contact-item">
                <MobileFilled style={themedIconStyle} />
                {profile.mobile}
              </span>
            ) : null}
            {profile?.email ? (
              <span className="contact-item">
                <MailFilled style={themedIconStyle} />
                {profile.email}
              </span>
            ) : null}
            {profile?.github ? (
              <span
                className="contact-item link"
                onClick={() => openExternalLink(profile.github)}
              >
                <GithubFilled style={themedIconStyle} />
                GitHub
              </span>
            ) : null}
            {profile?.zhihu ? (
              <span
                className="contact-item link"
                onClick={() => openExternalLink(profile.zhihu)}
              >
                <ZhihuCircleFilled style={themedIconStyle} />
                知乎
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="resume-flow">
        {aboutmeList &&
        aboutmeList.length > 0 &&
        _.trim(aboutmeList.join('')) ? (
          <ModernSection
            title={<FormattedMessage id="自我介绍" />}
            color={theme.color}
            contentClassName="about-content"
          >
            <AboutMeItems aboutmeList={aboutmeList} paragraphTag="p" />
          </ModernSection>
        ) : null}

        {workExpList?.length ? (
          <ModernSection title={titleNameMap?.workExpList} color={theme.color}>
            <ModernWorkExperienceItems
              workExpList={workExpList}
              presentLabel={presentLabel}
            />
          </ModernSection>
        ) : null}

        {projectList?.length ? (
          <ModernSection title={titleNameMap?.projectList} color={theme.color}>
            <ModernProjectItems projectList={projectList} theme={theme} />
          </ModernSection>
        ) : null}

        {educationList?.length ? (
          <ModernSection
            title={titleNameMap?.educationList}
            color={theme.color}
          >
            <ModernEducationItems
              educationList={educationList}
              presentLabel={presentLabel}
            />
          </ModernSection>
        ) : null}

        {skillList?.length || awardList?.length || workList?.length ? (
          <div className="resume-utility-grid">
            {skillList?.length || awardList?.length ? (
              <ModernSection
                title={titleNameMap?.skillList}
                color={theme.color}
                className="utility-section"
              >
                <ModernSkillAwardItems
                  skillList={skillList}
                  awardList={awardList}
                />
              </ModernSection>
            ) : null}

            {workList?.length ? (
              <ModernSection
                title={
                  titleNameMap?.workList ||
                  intl.formatMessage({ id: '个人作品' })
                }
                color={theme.color}
                className="utility-section"
              >
                <div className="portfolio-list">
                  <PortfolioItems workList={workList} />
                </div>
              </ModernSection>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
