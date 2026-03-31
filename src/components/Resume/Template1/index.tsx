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
  ClassicAwardItems,
  ClassicEducationItems,
  ClassicProjectItems,
  ClassicSkillItems,
  ClassicWorkExperienceItems,
  PortfolioItems,
} from '../shared-sections';
import { ClickableText, Template1FeatureSection } from '../shared-layouts';
import './index.less';

type Props = {
  value: ResumeConfig;
  theme: ThemeConfig;
};

/**
 * @description 简历内容区
 */
export const Template1: React.FC<Props> = props => {
  const intl = useIntl();
  const { value, theme } = props;
  const themedIconStyle = { color: theme.color, opacity: 0.85 };
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
    <div className="template1-resume resume-content">
      <div className="basic-info">
        {/* 头像 */}
        {!value?.avatar?.hidden && (
          <Avatar
            avatarSrc={value?.avatar?.src}
            className="avatar"
            shape={value?.avatar?.shape}
            size={value?.avatar?.size}
          />
        )}
        {/* 个人信息 */}
        <div className="profile">
          {profile?.name && <div className="name">{profile.name}</div>}
          <div className="profile-list">
            {profile?.mobile && (
              <div className="email">
                <MobileFilled style={themedIconStyle} />
                {profile.mobile}
              </div>
            )}
            {profile?.email && (
              <div className="email">
                <MailFilled style={themedIconStyle} />
                {profile.email}
              </div>
            )}
            {profile?.github && (
              <div className="github">
                <GithubFilled style={themedIconStyle} />
                <ClickableText onClick={() => openExternalLink(profile.github)}>
                  {profile.github}
                </ClickableText>
              </div>
            )}
            {profile?.zhihu && (
              <div className="github">
                <ZhihuCircleFilled style={themedIconStyle} />
                <ClickableText onClick={() => openExternalLink(profile.zhihu)}>
                  {profile.zhihu}
                </ClickableText>
              </div>
            )}
            {profile?.workExpYear && (
              <div className="work-exp-year">
                <ScheduleFilled style={themedIconStyle} />
                <span>
                  <FormattedMessage id="工作经验" />: {profile.workExpYear}
                </span>
              </div>
            )}
            {profile?.workPlace && (
              <div className="work-place">
                <EnvironmentFilled style={themedIconStyle} />
                <span>
                  <FormattedMessage id="期望工作地" />: {profile.workPlace}
                </span>
              </div>
            )}
            {profile?.positionTitle && (
              <div className="expect-job">
                <HeartFilled style={themedIconStyle} />
                <span>
                  <FormattedMessage id="职位" />: {profile.positionTitle}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* 自我介绍 */}
        {!!_.trim(_.join(aboutmeList, '')) && (
          <section className="section section-aboutme">
            <div className="section-title" style={{ color: theme.color }}>
              <FormattedMessage id="自我介绍" />
            </div>
            <AboutMeItems aboutmeList={aboutmeList} />
          </section>
        )}
        {/* 教育背景 */}
        {educationList?.length ? (
          <section className="section section-education">
            <div className="section-title" style={{ color: theme.color }}>
              {/* <FormattedMessage id="教育背景" /> */}
              {titleNameMap?.educationList}
            </div>
            <ClassicEducationItems
              educationList={educationList}
              presentLabel={presentLabel}
            />
          </section>
        ) : null}
        {workList?.length ? (
          <section className="section section-work">
            <div className="section-title" style={{ color: theme.color }}>
              {titleNameMap?.workList}
            </div>
            <PortfolioItems workList={workList} />
          </section>
        ) : null}
        {/* 专业技能 */}
        {skillList?.length ? (
          <section className="section section-skill">
            <div className="section-title" style={{ color: theme.color }}>
              {titleNameMap?.skillList}
            </div>
            <ClassicSkillItems skillList={skillList} />
          </section>
        ) : null}
        {/* 更多信息 */}
        {awardList?.length ? (
          <section className="section section-award">
            <div className="section-title" style={{ color: theme.color }}>
              {titleNameMap?.awardList}
            </div>
            <ClassicAwardItems awardList={awardList} />
          </section>
        ) : null}
      </div>
      <div className="main-info">
        {workExpList?.length ? (
          <Template1FeatureSection
            id="work-experience"
            title={titleNameMap?.workExpList}
            color={theme.color}
          >
            <div className="section section-work-exp">
              <ClassicWorkExperienceItems
                workExpList={workExpList}
                presentLabel={presentLabel}
              />
            </div>
          </Template1FeatureSection>
        ) : null}

        {projectList?.length ? (
          <Template1FeatureSection
            id="skill"
            title={titleNameMap?.projectList}
            color={theme.color}
          >
            <div className="section section-project">
              <ClassicProjectItems projectList={projectList} theme={theme} />
            </div>
          </Template1FeatureSection>
        ) : null}
      </div>
    </div>
  );
};
