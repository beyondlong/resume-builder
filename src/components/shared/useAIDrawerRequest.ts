import React from 'react';
import { resolveAIErrorMessage } from './ai-errors';

type Params<T> = {
  request: () => Promise<T>;
  formatMessage: (id: string) => string;
};

type Result<T> = {
  open: boolean;
  loading: boolean;
  error: string | null;
  data: T | null;
  handleOpen: () => Promise<void>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useAIDrawerRequest = <T>({
  request,
  formatMessage,
}: Params<T>): Result<T> => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleOpen = React.useCallback(async (): Promise<void> => {
    setOpen(true);
    setLoading(true);
    setError(null);

    try {
      const response = await request();
      setData(response);
    } catch (err) {
      setError(resolveAIErrorMessage(err, formatMessage));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [formatMessage, request]);

  return {
    open,
    loading,
    error,
    data,
    handleOpen,
    setOpen,
  };
};
