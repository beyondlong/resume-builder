import React, { useCallback, useState, useEffect } from 'react';
import { Spin } from 'antd';
import _ from 'lodash-es';
import qs from 'query-string';
import { FormattedMessage, useIntl } from 'react-intl';
import { getLanguage } from '@/i18n';
import { getDefaultTitleNameMap } from '@/data/constant';
import { getSearchObj } from '@/helpers/location';
import { customAssign } from '@/helpers/customAssign';
import { getDevice } from '@/helpers/detect-device';
import { saveToStorage, loadFromStorage } from '@/helpers/storage';
import { Resume } from './Resume';
import type { ResumeConfig, ThemeConfig } from './types';
import { RESUME_INFO } from '@/data/resume';

import './index.less';

export const Page: React.FC = () => {
  const lang = getLanguage();
  const intl = useIntl();
  const query = getSearchObj();

  const [config, setConfig] = useState<ResumeConfig>();
  const [loading, updateLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<ThemeConfig>({
    color: '#2f5785',
    tagColor: '#8bc34a',
  });

  const currentTemplate = (query.template || 'template1') as string;

  const changeConfig = (v: Partial<ResumeConfig>) => {
    setConfig(
      _.assign({}, { titleNameMap: getDefaultTitleNameMap({ intl }) }, v)
    );
  };

  // 优先从 localStorage 加载，如果没有则从 resume.json 加载
  useEffect(() => {
    const cached = loadFromStorage();
    if (cached) {
      changeConfig(
        _.omit(customAssign({}, cached, _.get(cached, ['locales', lang])), [
          'locales',
        ])
      );
      updateLoading(false);
      return;
    }

    // 如果没有缓存，从 resume.json 加载
    fetch('/resume.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(data => {
        saveToStorage(data);
        changeConfig(
          _.omit(customAssign({}, data, _.get(data, ['locales', lang])), [
            'locales',
          ])
        );
        updateLoading(false);
      })
      .catch(() => {
        saveToStorage(RESUME_INFO);
        changeConfig(RESUME_INFO);
        updateLoading(false);
      });
  }, [lang]);

  useEffect(() => {
    if (getDevice() === 'mobile') {
      // Mobile message is handled in header or can be removed
    }
  }, []);

  return (
    <div className="page">
      <Spin spinning={loading}>
        {config && (
          <Resume
            value={config}
            theme={theme}
            template={currentTemplate}
          />
        )}
      </Spin>
    </div>
  );
};

export default Page;
