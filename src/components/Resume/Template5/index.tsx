import React from 'react';
import {
  EnvironmentFilled,
  GithubFilled,
  MailFilled,
  MobileFilled,
  ScheduleFilled,
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

export const Template5: React.FC<Props> = ({ value, theme }) => {
  const intl = useIntl();
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
    <div className="template5-resume resume-content">
      <div className="resume-topbar">
        <div className="topbar-identity">
          {!value?.avatar?.hidden && (
            <Avatar
              avatarSrc={value?.avatar?.src}
              className="avatar"
              shape={value?.avatar?.shape}
              size={value?.avatar?.size}
            />
          )}
          <div className="identity-copy">
            <h1 className="name">{profile?.name}</h1>
            {profile?.positionTitle ? (
              <div className="position-title">{profile.positionTitle}</div>
            ) : null}
          </div>
        </div>

        <div className="topbar-contacts">
          {profile?.mobile ? (
            <div className="contact-item">
              <MobileFilled />
              <span>{profile.mobile}</span>
            </div>
          ) : null}
          {profile?.email ? (
            <div className="contact-item">
              <MailFilled />
              <span>{profile.email}</span>
            </div>
          ) : null}
          {profile?.github ? (
            <div
              className="contact-item link"
              onClick={() => openExternalLink(profile.github)}
            >
              <GithubFilled />
              <span>GitHub</span>
            </div>
          ) : null}
          {profile?.zhihu ? (
            <div
              className="contact-item link"
              onClick={() => openExternalLink(profile.zhihu)}
            >
              <ZhihuCircleFilled />
              <span>知乎</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="resume-column-layout">
        <aside className="resume-sidebar">
          <div className="contact-section">
            <h3 className="section-label">
              {intl.formatMessage({ id: '个人信息' })}
            </h3>
            <div className="contact-list">
              {profile?.workExpYear ? (
                <div className="contact-item">
                  <ScheduleFilled />
                  <span>{profile.workExpYear}</span>
                </div>
              ) : null}
              {profile?.workPlace ? (
                <div className="contact-item">
                  <EnvironmentFilled />
                  <span>{profile.workPlace}</span>
                </div>
              ) : null}
            </div>
          </div>

          {skillList?.length || awardList?.length ? (
            <div className="skills-section">
              <h3 className="section-label">{titleNameMap?.skillList}</h3>
              <ModernSkillAwardItems
                skillList={skillList}
                awardList={awardList}
              />
            </div>
          ) : null}

          {workList?.length ? (
            <div className="portfolio-section">
              <h3 className="section-label">
                {titleNameMap?.workList ||
                  intl.formatMessage({ id: '个人作品' })}
              </h3>
              <div className="portfolio-list">
                <PortfolioItems workList={workList} />
              </div>
            </div>
          ) : null}
        </aside>

        <main className="resume-main">
          {aboutmeList &&
          aboutmeList.length > 0 &&
          _.trim(aboutmeList.join('')) ? (
            <ModernSection
              title={<FormattedMessage id="自我介绍" />}
              color={theme.color}
              contentClassName="section-body about-content"
            >
              <AboutMeItems aboutmeList={aboutmeList} paragraphTag="p" />
            </ModernSection>
          ) : null}

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

          {projectList?.length ? (
            <ModernSection
              title={titleNameMap?.projectList}
              color={theme.color}
              contentClassName="section-body"
            >
              <ModernProjectItems projectList={projectList} theme={theme} />
            </ModernSection>
          ) : null}

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
        </main>
      </div>
    </div>
  );
};
