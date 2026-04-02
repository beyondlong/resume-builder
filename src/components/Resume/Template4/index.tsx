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
 * @description 模板4 - 现代简洁风格
 * 单栏布局，顶部姓名+联系方式横排，内容垂直排列
 */
export const Template4: React.FC<Props> = props => {
  const intl = useIntl();
  const { value, theme } = props;
  const themedIconStyle = { color: theme.color };
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
    <div className="template4-resume resume-content">
      {/* 头部区域 */}
      <div className="resume-header" style={{ borderBottomColor: theme.color }}>
        {!value?.avatar?.hidden && (
          <Avatar
            avatarSrc={value?.avatar?.src}
            className="avatar"
            shape={value?.avatar?.shape}
            size={value?.avatar?.size}
          />
        )}
        {/* 姓名 */}
        <h1 className="name" style={{ color: theme.color }}>
          {profile?.name}
        </h1>

        {/* 联系方式横排 */}
        <div className="contact-row">
          {profile?.mobile && (
            <span className="contact-item">
              <MobileFilled style={themedIconStyle} />
              {profile.mobile}
            </span>
          )}
          {profile?.email && (
            <span className="contact-item">
              <MailFilled style={themedIconStyle} />
              {profile.email}
            </span>
          )}
          {profile?.github && (
            <span
              className="contact-item link"
              onClick={() => openExternalLink(profile.github)}
            >
              <GithubFilled style={themedIconStyle} />
              GitHub
            </span>
          )}
          {profile?.zhihu && (
            <span
              className="contact-item link"
              onClick={() => openExternalLink(profile.zhihu)}
            >
              <ZhihuCircleFilled style={themedIconStyle} />
              知乎
            </span>
          )}
          {profile?.workExpYear && (
            <span className="contact-item">
              <ScheduleFilled style={themedIconStyle} />
              {profile.workExpYear}
            </span>
          )}
          {profile?.workPlace && (
            <span className="contact-item">
              <EnvironmentFilled style={themedIconStyle} />
              {profile.workPlace}
            </span>
          )}
          {profile?.positionTitle && (
            <span className="contact-item">
              <HeartFilled style={themedIconStyle} />
              {profile.positionTitle}
            </span>
          )}
        </div>
      </div>

      {/* 主体内容 */}
      <div className="resume-body">
        {/* 工作经历 */}
        {workExpList?.length ? (
          <ModernSection title={titleNameMap?.workExpList} color={theme.color}>
            <ModernWorkExperienceItems
              workExpList={workExpList}
              presentLabel={presentLabel}
            />
          </ModernSection>
        ) : null}

        {/* 项目经验 */}
        {projectList?.length ? (
          <ModernSection title={titleNameMap?.projectList} color={theme.color}>
            <ModernProjectItems projectList={projectList} theme={theme} />
          </ModernSection>
        ) : null}

        {/* 教育背景 */}
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

        {/* 技能证书 */}
        {skillList?.length || awardList?.length ? (
          <ModernSection title={titleNameMap?.skillList} color={theme.color}>
            <ModernSkillAwardItems
              skillList={skillList}
              awardList={awardList}
            />
          </ModernSection>
        ) : null}

        {/* 自我介绍 */}
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
      </div>
    </div>
  );
};
