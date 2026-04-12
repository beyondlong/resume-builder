import { useAIDrawerRequest } from '@/components/shared/useAIDrawerRequest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

const TestHarness: React.FC<{
  request: () => Promise<string>;
  formatMessage?: (id: string) => string;
}> = ({ request, formatMessage }) => {
  const {
    open,
    loading,
    error,
    data,
    handleOpen,
    setOpen,
  } = useAIDrawerRequest({
    request,
    formatMessage: formatMessage || (id => id),
  });

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        open
      </button>
      <button type="button" onClick={() => setOpen(false)}>
        close
      </button>
      <span data-testid="open">{String(open)}</span>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="error">{error || ''}</span>
      <span data-testid="data">{data || ''}</span>
    </div>
  );
};

describe('useAIDrawerRequest', () => {
  it('opens the drawer and stores resolved data', async () => {
    let resolveRequest: ((value: string) => void) | null = null;
    const request = jest.fn(
      () =>
        new Promise<string>(resolve => {
          resolveRequest = resolve;
        })
    );

    render(<TestHarness request={request} />);

    await userEvent.click(screen.getByRole('button', { name: 'open' }));

    expect(screen.getByTestId('open')).toHaveTextContent('true');
    expect(screen.getByTestId('loading')).toHaveTextContent('true');

    await act(async () => {
      resolveRequest?.('payload');
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('data')).toHaveTextContent('payload');
      expect(screen.getByTestId('error')).toHaveTextContent('');
    });
  });

  it('maps known AI errors and clears stale data on failure', async () => {
    let resolveRequest: ((value: string) => void) | null = null;
    let rejectRequest: ((error: Error) => void) | null = null;
    const request = jest
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<string>(resolve => {
            resolveRequest = resolve;
          })
      )
      .mockImplementationOnce(
        () =>
          new Promise<string>((_resolve, reject) => {
            rejectRequest = reject;
          })
      );

    render(<TestHarness request={request} formatMessage={id => `msg:${id}`} />);

    await userEvent.click(screen.getByRole('button', { name: 'open' }));
    await act(async () => {
      resolveRequest?.('payload');
    });
    await waitFor(() => {
      expect(screen.getByTestId('data')).toHaveTextContent('payload');
    });

    await userEvent.click(screen.getByRole('button', { name: 'open' }));
    await act(async () => {
      rejectRequest?.(
        Object.assign(new Error('boom'), { name: 'AI_PROXY_UNAVAILABLE' })
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('data')).toHaveTextContent('');
      expect(screen.getByTestId('error')).toHaveTextContent('msg:AI代理不可用');
    });
  });
});
