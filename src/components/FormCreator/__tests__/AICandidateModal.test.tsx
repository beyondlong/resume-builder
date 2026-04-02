import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { AICandidateModal } from '@/components/FormCreator/AICandidateModal';

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider
      locale="zh-CN"
      messages={{
        AI建议: 'AI建议',
        应用此版本: '应用此版本',
        AI暂无可用建议: 'AI暂无可用建议',
      }}
    >
      {ui}
    </IntlProvider>
  );

describe('AICandidateModal', () => {
  it('renders candidates and applies the selected one', async () => {
    const onApply = jest.fn();

    renderWithIntl(
      <AICandidateModal
        open={true}
        candidates={[{ id: 'candidate-1', content: '候选文案' }]}
        onApply={onApply}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText('候选文案')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '应用此版本' }));

    expect(onApply).toHaveBeenCalledWith({
      id: 'candidate-1',
      content: '候选文案',
    });
  });
});
