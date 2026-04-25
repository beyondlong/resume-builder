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
import { ClickableText, ModernSection } from '../shared-layouts';
import './index.less';

type Props = {
  value: ResumeConfig;
  theme: ThemeConfig;
};

export const Template7: React.FC<Props> = ({ value, theme }) => {
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
  const iconStyle = { color: theme.color };

  return (
    <div className="template7-resume resume-content">
      <header className="dev-header">
        <div className="window-bar">
          <span />
          <span />
          <span />
          <b>候选人档案</b>
        </div>
        <div className="dev-identity">
          {!value?.avatar?.hidden && (
            <Avatar
              avatarSrc={value?.avatar?.src}
              className="avatar"
              shape={value?.avatar?.shape}
              size={value?.avatar?.size}
            />
          )}
          <div className="identity-copy">
            <div className="identity-meta">
              <span className="keyword">PROFILE</span>
              <span className="variable">核心身份</span>
            </div>
            <h1 className="name">{profile?.name}</h1>
            {profile?.positionTitle ? (
              <div className="position-title">
                职业定位
                <span style={{ color: theme.color }}>
                  {profile.positionTitle}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="dev-layout">
        <aside className="dev-sidebar">
          <section className="dev-panel">
            <h2 className="panel-title">联系方式</h2>
            <div className="contact-list">
              {profile?.mobile ? (
                <div className="contact-item">
                  <MobileFilled style={iconStyle} />
                  <span>{profile.mobile}</span>
                </div>
              ) : null}
              {profile?.email ? (
                <div className="contact-item">
                  <MailFilled style={iconStyle} />
                  <span>{profile.email}</span>
                </div>
              ) : null}
              {profile?.github ? (
                <div className="contact-item link">
                  <GithubFilled style={iconStyle} />
                  <ClickableText
                    onClick={() => openExternalLink(profile.github)}
                  >
                    GitHub
                  </ClickableText>
                </div>
              ) : null}
              {profile?.zhihu ? (
                <div className="contact-item link">
                  <ZhihuCircleFilled style={iconStyle} />
                  <ClickableText
                    onClick={() => openExternalLink(profile.zhihu)}
                  >
                    知乎
                  </ClickableText>
                </div>
              ) : null}
              {profile?.workExpYear ? (
                <div className="contact-item">
                  <ScheduleFilled style={iconStyle} />
                  <span>{profile.workExpYear}</span>
                </div>
              ) : null}
              {profile?.workPlace ? (
                <div className="contact-item">
                  <EnvironmentFilled style={iconStyle} />
                  <span>{profile.workPlace}</span>
                </div>
              ) : null}
            </div>
          </section>

          {skillList?.length || awardList?.length ? (
            <section className="dev-panel stack-panel">
              <h2 className="panel-title">技术栈</h2>
              <ModernSkillAwardItems
                skillList={skillList}
                awardList={awardList}
              />
            </section>
          ) : null}

          {workList?.length ? (
            <section className="dev-panel">
              <h2 className="panel-title">links.md</h2>
              <div className="portfolio-list">
                <PortfolioItems workList={workList} />
              </div>
            </section>
          ) : null}
        </aside>

        <main className="dev-main">
          {aboutmeList &&
          aboutmeList.length > 0 &&
          _.trim(aboutmeList.join('')) ? (
            <ModernSection
              title={<FormattedMessage id="自我介绍" />}
              color={theme.color}
              className="dev-section readme-section"
              contentClassName="about-content"
            >
              <AboutMeItems aboutmeList={aboutmeList} paragraphTag="p" />
            </ModernSection>
          ) : null}

          {workExpList?.length ? (
            <ModernSection
              title={titleNameMap?.workExpList}
              color={theme.color}
              className="dev-section"
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
              className="dev-section project-section"
            >
              <ModernProjectItems projectList={projectList} theme={theme} />
            </ModernSection>
          ) : null}

          {educationList?.length ? (
            <ModernSection
              title={titleNameMap?.educationList}
              color={theme.color}
              className="dev-section compact-section"
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
