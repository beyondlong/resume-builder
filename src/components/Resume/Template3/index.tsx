import React from 'react';
import {
  PhoneFilled,
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
import {
  ClickableText,
  Template3CardSection,
  Template3FeatureSection,
} from '../shared-layouts';
import './index.less';

type Props = {
  value: ResumeConfig;
  theme: ThemeConfig;
};

export const Template3: React.FC<Props> = props => {
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
    <div className="template3-resume resume-content">
      <div className="basic-info">
        <div className="profile">
          {profile?.name && <div className="name">{profile.name}</div>}
          <div className="profile-list">
            {profile?.mobile && (
              <div className="mobile">
                <PhoneFilled style={themedIconStyle} />
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

        {educationList?.length ? (
          <Template3CardSection
            title={titleNameMap.educationList}
            className="section section-education"
            color={theme.color}
          >
            <ClassicEducationItems
              educationList={educationList}
              presentLabel={presentLabel}
            />
          </Template3CardSection>
        ) : null}

        {workList?.length ? (
          <Template3CardSection
            title={titleNameMap.workList}
            className="section section-work"
            color={theme.color}
          >
            <PortfolioItems workList={workList} />
          </Template3CardSection>
        ) : null}

        <Template3CardSection
          title={<FormattedMessage id="自我介绍" />}
          className="section section-aboutme"
          color={theme.color}
        >
          <AboutMeItems aboutmeList={aboutmeList} />
        </Template3CardSection>

        {skillList?.length ? (
          <Template3CardSection
            title={titleNameMap.skillList}
            className="section section-skill"
            color={theme.color}
          >
            <ClassicSkillItems skillList={skillList} />
          </Template3CardSection>
        ) : null}

        {awardList?.length ? (
          <Template3CardSection
            title={titleNameMap.awardList}
            className="section section-award"
            color={theme.color}
          >
            <ClassicAwardItems awardList={awardList} />
          </Template3CardSection>
        ) : null}
      </div>

      <div className="main-info">
        {workExpList?.length ? (
          <Template3FeatureSection
            title={titleNameMap?.workExpList}
            color={theme.color}
          >
            <div className="section section-work-exp">
              <ClassicWorkExperienceItems
                workExpList={workExpList}
                presentLabel={presentLabel}
              />
            </div>
          </Template3FeatureSection>
        ) : null}

        {projectList?.length ? (
          <Template3FeatureSection
            title={titleNameMap?.projectList}
            color={theme.color}
          >
            <div className="section section-project">
              <ClassicProjectItems projectList={projectList} theme={theme} />
            </div>
          </Template3FeatureSection>
        ) : null}
      </div>
    </div>
  );
};
