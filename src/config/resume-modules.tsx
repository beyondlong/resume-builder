import React from 'react';
import {
  ContactsTwoTone,
  ProfileTwoTone,
  ProjectTwoTone,
  RocketTwoTone,
  ScheduleTwoTone,
  SmileTwoTone,
  TagsTwoTone,
  ToolTwoTone,
  TrophyTwoTone,
} from '@ant-design/icons';
import _ from 'lodash-es';
import type { ResumeConfig } from '@/components/types';
import type { ResumeIntlShape, ResumeModuleDefinition } from './types';

export const getResumeModules = ({
  intl,
  titleNameMap,
}: {
  intl: ResumeIntlShape;
  titleNameMap?: ResumeConfig['titleNameMap'];
}): ResumeModuleDefinition[] => {
  const modules: ResumeModuleDefinition[] = [
    {
      name: intl.formatMessage({ id: '头像设置' }),
      icon: <ContactsTwoTone />,
      key: 'avatar',
    },
    {
      name: intl.formatMessage({ id: '个人信息' }),
      icon: <ProfileTwoTone />,
      key: 'profile',
    },
    {
      name: intl.formatMessage({ id: '教育背景' }),
      icon: <ScheduleTwoTone />,
      key: 'educationList',
    },
    {
      name: intl.formatMessage({ id: '自我介绍' }),
      icon: <SmileTwoTone />,
      key: 'aboutme',
    },
    {
      name: intl.formatMessage({ id: '更多信息' }),
      icon: <TrophyTwoTone />,
      key: 'awardList',
    },
    {
      name: intl.formatMessage({ id: '个人作品' }),
      icon: <ToolTwoTone />,
      key: 'workList',
    },
    {
      name: intl.formatMessage({ id: '专业技能' }),
      icon: <RocketTwoTone />,
      key: 'skillList',
    },
    {
      name: intl.formatMessage({ id: '工作经历' }),
      icon: <TagsTwoTone />,
      key: 'workExpList',
    },
    {
      name: intl.formatMessage({ id: '项目经历' }),
      icon: <ProjectTwoTone />,
      key: 'projectList',
    },
  ];

  return modules.map(module => {
    const name = _.get(titleNameMap, module.key);
    return { ...module, name: _.isNil(name) ? module.name : name };
  });
};
