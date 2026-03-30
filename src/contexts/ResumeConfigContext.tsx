import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ResumeConfig } from '@/components/types';

type ResumeConfigContextType = {
  config: ResumeConfig;
  updateConfig: (partial: Partial<ResumeConfig>) => void;
  resetConfig: (newConfig: ResumeConfig) => void;
  isDirty: boolean;
};

const ResumeConfigContext = createContext<ResumeConfigContextType | null>(null);

type Props = {
  initialValue: ResumeConfig;
  children: React.ReactNode;
};

export const ResumeConfigProvider: React.FC<Props> = ({
  initialValue,
  children,
}) => {
  const [config, setConfig] = useState<ResumeConfig>(initialValue);
  const [isDirty, setIsDirty] = useState(false);

  const updateConfig = useCallback((partial: Partial<ResumeConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
    setIsDirty(true);
  }, []);

  const resetConfig = useCallback((newConfig: ResumeConfig) => {
    setConfig(newConfig);
    setIsDirty(false);
  }, []);

  return (
    <ResumeConfigContext.Provider
      value={{ config, updateConfig, resetConfig, isDirty }}
    >
      {children}
    </ResumeConfigContext.Provider>
  );
};

export const useResumeConfig = (): ResumeConfigContextType => {
  const context = useContext(ResumeConfigContext);
  if (!context) {
    throw new Error('useResumeConfig must be used within ResumeConfigProvider');
  }
  return context;
};
