import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';
import type { ResumeConfig } from '@/components/types';

type ResumeConfigContextType = {
  config: ResumeConfig;
  updateConfig: (partial: Partial<ResumeConfig>) => void;
  resetConfig: (newConfig: ResumeConfig) => void;
  isDirty: boolean;
};

const ResumeConfigContext = createContext<ResumeConfigContextType | null>(null);

type ResumeConfigState = {
  config: ResumeConfig;
  isDirty: boolean;
};

type ResumeConfigAction =
  | { type: 'update'; partial: Partial<ResumeConfig> }
  | { type: 'reset'; config: ResumeConfig };

const resumeConfigReducer = (
  state: ResumeConfigState,
  action: ResumeConfigAction
): ResumeConfigState => {
  switch (action.type) {
    case 'update':
      return {
        config: { ...state.config, ...action.partial },
        isDirty: true,
      };
    case 'reset':
      return {
        config: action.config,
        isDirty: false,
      };
    default:
      return state;
  }
};

type Props = {
  initialValue: ResumeConfig;
  children: React.ReactNode;
};

export const ResumeConfigProvider: React.FC<Props> = ({
  initialValue,
  children,
}) => {
  const [state, dispatch] = useReducer(resumeConfigReducer, {
    config: initialValue,
    isDirty: false,
  });

  const updateConfig = useCallback((partial: Partial<ResumeConfig>) => {
    dispatch({ type: 'update', partial });
  }, []);

  const resetConfig = useCallback((newConfig: ResumeConfig) => {
    dispatch({ type: 'reset', config: newConfig });
  }, []);

  return (
    <ResumeConfigContext.Provider
      value={{
        config: state.config,
        updateConfig,
        resetConfig,
        isDirty: state.isDirty,
      }}
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
