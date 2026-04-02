import React from 'react';
import { Button } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';

type Props = {
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export const AIImproveButton: React.FC<Props> = ({
  loading = false,
  disabled = false,
  onClick,
}) => {
  return (
    <Button
      size="small"
      type="default"
      className="ai-improve-button"
      icon={<RobotOutlined />}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
    >
      <FormattedMessage id="AI优化" />
    </Button>
  );
};
