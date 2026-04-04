import type { AIMockInterviewQuestion } from '@/services/ai/types';
import { Card } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const InterviewQuestionCard: React.FC<{
  question: AIMockInterviewQuestion;
}> = ({ question }) => {
  return (
    <Card className="ai-mock-interview-card" size="small">
      <div className="ai-mock-interview-card__eyebrow">
        <FormattedMessage id="简历模拟问题" />
      </div>
      <h4>{question.question}</h4>
      <div className="ai-mock-interview-card__section">
        <strong>
          <FormattedMessage id="提问意图" />
        </strong>
        <p>{question.intent}</p>
      </div>
      <div className="ai-mock-interview-card__section">
        <strong>
          <FormattedMessage id="回答思路" />
        </strong>
        <ul>
          {question.answerGuidance.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      {question.resumeEvidence ? (
        <div className="ai-mock-interview-card__section">
          <strong>
            <FormattedMessage id="简历依据" />
          </strong>
          <p>{question.resumeEvidence}</p>
        </div>
      ) : null}
    </Card>
  );
};
