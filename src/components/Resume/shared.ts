import _ from 'lodash-es';
import type { IntlShape } from 'react-intl';
import { getDefaultTitleNameMap } from '@/data/constant';
import type { ResumeConfig } from '../types';

export const getResumeViewModel = (value: ResumeConfig, intl: IntlShape) => ({
  profile: _.get(value, 'profile'),
  titleNameMap: _.get(value, 'titleNameMap', getDefaultTitleNameMap({ intl })),
  educationList: _.get(value, 'educationList'),
  workExpList: _.get(value, 'workExpList'),
  projectList: _.get(value, 'projectList'),
  skillList: _.get(value, 'skillList'),
  awardList: _.get(value, 'awardList'),
  workList: _.get(value, 'workList'),
  aboutmeList: _.split(_.get(value, ['aboutme', 'aboutme_desc']), '\n'),
  presentLabel: intl.formatMessage({ id: '至今' }),
});
