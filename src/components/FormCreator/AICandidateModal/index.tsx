import React from 'react';
import { Button, Empty, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import type { AIImproveCandidate } from '@/services/ai/types';

type Props = {
  open: boolean;
  candidates: AIImproveCandidate[];
  loading?: boolean;
  error?: string | null;
  onApply: (candidate: AIImproveCandidate) => void;
  onCancel: () => void;
};

export const AICandidateModal: React.FC<Props> = ({
  open,
  candidates,
  loading = false,
  error,
  onApply,
  onCancel,
}) => {
  return (
    <Modal
      visible={open}
      title={<FormattedMessage id="AI建议" />}
      footer={null}
      onCancel={onCancel}
      destroyOnClose
    >
      {error ? <div className="ai-candidate-error">{error}</div> : null}
      {!error && candidates.length === 0 ? (
        <Empty description={<FormattedMessage id="AI暂无可用建议" />} />
      ) : null}
      <div className="ai-candidate-list">
        {candidates.map(candidate => (
          <div className="ai-candidate-card" key={candidate.id}>
            <div className="ai-candidate-content">{candidate.content}</div>
            <Button
              type="primary"
              size="small"
              loading={loading}
              onClick={() => onApply(candidate)}
            >
              <FormattedMessage id="应用此版本" />
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  );
};
