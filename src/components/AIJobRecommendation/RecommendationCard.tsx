import type { AIRecommendedRole } from '@/services/ai/types';
import { Card, Tag } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const RecommendationCard: React.FC<{
  role: AIRecommendedRole;
}> = ({ role }) => {
  return (
    <Card className="ai-job-recommendation-card" size="small">
      <div className="ai-job-recommendation-card__header">
        <div className="ai-job-recommendation-card__title-group">
          <span className="ai-job-recommendation-card__eyebrow">
            <FormattedMessage id="岗位方向" />
          </span>
          <h4>{role.title}</h4>
        </div>
        <span className="ai-job-recommendation-card__score">
          <FormattedMessage id="匹配度" /> {role.score}
        </span>
      </div>

      <div className="ai-job-recommendation-card__section">
        <strong>
          <FormattedMessage id="推荐行业" />
        </strong>
        <div className="ai-job-recommendation-card__tags">
          {role.industries.map(item => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>
      </div>

      <div className="ai-job-recommendation-card__section">
        <strong>
          <FormattedMessage id="公司类型" />
        </strong>
        <div className="ai-job-recommendation-card__tags">
          {role.companyTypes.map(item => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>
      </div>

      <div className="ai-job-recommendation-card__section">
        <strong>
          <FormattedMessage id="技术标签" />
        </strong>
        <div className="ai-job-recommendation-card__tags">
          {role.techTags.map(item => (
            <Tag key={item} color="blue">
              {item}
            </Tag>
          ))}
        </div>
      </div>

      <div className="ai-job-recommendation-card__section">
        <strong>
          <FormattedMessage id="匹配理由" />
        </strong>
        <ul>
          {role.reasons.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="ai-job-recommendation-card__section">
        <strong>
          <FormattedMessage id="简历建议" />
        </strong>
        <ul>
          {role.suggestions.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
