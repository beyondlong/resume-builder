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
  ClassicEducationItems,
  ClassicProjectItems,
  ClassicSkillItems,
  ClassicWorkExperienceItems,
  PortfolioItems,
} from '../shared-sections';
import { ClickableText, Template2Section } from '../shared-layouts';
import './index.less';

type Props = {
  value: ResumeConfig;
  theme: ThemeConfig;
};

/**
 * @description 简历内容区
 */
export const Template2: React.FC<Props> = props => {
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
    workList,
    aboutmeList,
    presentLabel,
  } = getResumeViewModel(value, intl);

  return (
    <div className="template2-resume resume-content">
      <div className="basic-info">
        <div className="profile">
          <div className="profile-info">
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
                  <ClickableText
                    onClick={() => openExternalLink(profile.github)}
                  >
                    {profile.github}
                  </ClickableText>
                </div>
              )}
              {profile?.zhihu && (
                <div className="github">
                  <ZhihuCircleFilled style={themedIconStyle} />
                  <ClickableText
                    onClick={() => openExternalLink(profile.zhihu)}
                  >
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
          {/* 头像 */}
          {!value?.avatar?.hidden && (
            <Avatar
              avatarSrc={value?.avatar?.src}
              className="avatar"
              shape={value?.avatar?.shape}
              size={value?.avatar?.size}
            />
          )}
        </div>
        {/* 教育背景 */}
        {educationList?.length ? (
          <Template2Section
            title={titleNameMap.educationList}
            className="section section-education"
            color={theme.color}
          >
            <ClassicEducationItems
              educationList={educationList}
              presentLabel={presentLabel}
            />
          </Template2Section>
        ) : null}
        {workList?.length ? (
          <Template2Section
            title={titleNameMap.workList}
            className="section section-work"
            color={theme.color}
          >
            <PortfolioItems workList={workList} />
          </Template2Section>
        ) : null}
        <Template2Section
          title={<FormattedMessage id="自我介绍" />}
          className="section section-aboutme"
          color={theme.color}
        >
          <AboutMeItems aboutmeList={aboutmeList} />
        </Template2Section>
        {/* 专业技能 */}
        {skillList?.length ? (
          <Template2Section
            title={titleNameMap.skillList}
            className="section section-skill"
            color={theme.color}
          >
            <ClassicSkillItems skillList={skillList} />
          </Template2Section>
        ) : null}
        {/* {awardList?.length ? (
          <Wrapper
            // title="更多信息"
            title={titleNameMap.awardList}
            className="section section-award"
            color={theme.color}
          >
            {awardList.map((award, idx) => {
              return (
                <div key={idx.toString()}>
                  <TrophyFilled
                    style={{ color: '#ffc107', marginRight: '8px' }}
                  />
                  <span className="info-name">{award.award_info}</span>
                  {award.award_time && (
                    <span className="sub-info award-time">
                      ({award.award_time})
                    </span>
                  )}
                </div>
              );
            })}
          </Wrapper>
        ) : null} */}
      </div>
      <div className="main-info">
        {workExpList?.length ? (
          <Template2Section
            className="experience"
            title={titleNameMap.workExpList}
            color={theme.color}
          >
            <div className="section section-work-exp">
              <ClassicWorkExperienceItems
                workExpList={workExpList}
                presentLabel={presentLabel}
              />
            </div>
          </Template2Section>
        ) : null}
        {projectList?.length ? (
          <Template2Section
            className="skill"
            title={titleNameMap.projectList}
            color={theme.color}
          >
            <div className="section section-project">
              <ClassicProjectItems projectList={projectList} theme={theme} />
            </div>
          </Template2Section>
        ) : null}
      </div>
    </div>
  );
};
