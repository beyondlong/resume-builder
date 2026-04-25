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
import { ClickableText, ModernSection } from '../shared-layouts';
import './index.less';

type Props = {
  value: ResumeConfig;
  theme: ThemeConfig;
};

export const Template6: React.FC<Props> = ({ value, theme }) => {
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
  const contactIconStyle = { color: theme.color };

  return (
    <div className="template6-resume resume-content">
      <header className="magazine-cover">
        <div className="cover-kicker" style={{ color: theme.color }}>
          Resume Portfolio
        </div>
      </header>

      <div className="magazine-layout">
        <aside className="magazine-aside">
          <section className="contact-block">
            <h2 className="aside-title">
              {intl.formatMessage({ id: '个人信息' })}
            </h2>
            <div className="contact-list">
              {profile?.mobile ? (
                <div className="contact-item">
                  <MobileFilled style={contactIconStyle} />
                  <span>{profile.mobile}</span>
                </div>
              ) : null}
              {profile?.email ? (
                <div className="contact-item">
                  <MailFilled style={contactIconStyle} />
                  <span>{profile.email}</span>
                </div>
              ) : null}
              {profile?.github ? (
                <div className="contact-item link">
                  <GithubFilled style={contactIconStyle} />
                  <ClickableText
                    onClick={() => openExternalLink(profile.github)}
                  >
                    GitHub
                  </ClickableText>
                </div>
              ) : null}
              {profile?.zhihu ? (
                <div className="contact-item link">
                  <ZhihuCircleFilled style={contactIconStyle} />
                  <ClickableText
                    onClick={() => openExternalLink(profile.zhihu)}
                  >
                    知乎
                  </ClickableText>
                </div>
              ) : null}
              {profile?.workExpYear ? (
                <div className="contact-item text-only">
                  <span>{profile.workExpYear}</span>
                </div>
              ) : null}
              {profile?.workPlace ? (
                <div className="contact-item text-only">
                  <span>{profile.workPlace}</span>
                </div>
              ) : null}
            </div>
          </section>

          {skillList?.length || awardList?.length ? (
            <section className="aside-panel">
              <h2 className="aside-title">{titleNameMap?.skillList}</h2>
              <ModernSkillAwardItems
                skillList={skillList}
                awardList={awardList}
              />
            </section>
          ) : null}

          {workList?.length ? (
            <section className="aside-panel">
              <h2 className="aside-title">
                {titleNameMap?.workList ||
                  intl.formatMessage({ id: '个人作品' })}
              </h2>
              <div className="portfolio-list">
                <PortfolioItems workList={workList} />
              </div>
            </section>
          ) : null}
        </aside>

        <main className="magazine-main">
          <section className="editorial-identity">
            <div className="identity-copy">
              <h1 className="name">{profile?.name}</h1>
              {profile?.positionTitle ? (
                <div className="position-title">{profile.positionTitle}</div>
              ) : null}
            </div>
            {!value?.avatar?.hidden && (
              <Avatar
                avatarSrc={value?.avatar?.src}
                className="avatar"
                shape={value?.avatar?.shape}
                size={value?.avatar?.size}
              />
            )}
          </section>

          {aboutmeList &&
          aboutmeList.length > 0 &&
          _.trim(aboutmeList.join('')) ? (
            <ModernSection
              title={<FormattedMessage id="自我介绍" />}
              color={theme.color}
              className="editorial-section intro-section"
              contentClassName="about-content"
            >
              <AboutMeItems aboutmeList={aboutmeList} paragraphTag="p" />
            </ModernSection>
          ) : null}

          {workExpList?.length ? (
            <ModernSection
              title={titleNameMap?.workExpList}
              color={theme.color}
              className="editorial-section"
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
              className="editorial-section project-section"
            >
              <ModernProjectItems projectList={projectList} theme={theme} />
            </ModernSection>
          ) : null}

          {educationList?.length ? (
            <ModernSection
              title={titleNameMap?.educationList}
              color={theme.color}
              className="editorial-section compact-section"
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
