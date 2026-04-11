import { ResumeEditor } from '@/components/ResumeEditor';
import { ResumeConfigProvider } from '@/contexts/ResumeConfigContext';
import { render } from '@testing-library/react';
import React from 'react';

jest.mock('@/components/AIJobRecommendation', () => ({
  AIJobRecommendation: () => <div data-testid="ai-job-recommendation" />,
}));

jest.mock('@/components/ResumeEditor/ModuleForm', () => ({
  ModuleForm: () => <div data-testid="module-form" />,
}));

jest.mock('@/components/ResumeEditor/ModuleList', () => ({
  ModuleList: () => <div data-testid="module-list" />,
}));

jest.mock('@/helpers/storage', () => ({
  saveToStorage: jest.fn(),
}));

describe('ResumeEditor', () => {
  it('renders dedicated sidebar and main layout regions for responsive styling', () => {
    const { container } = render(
      <ResumeConfigProvider
        initialValue={{
          profile: {
            name: 'Test User',
          },
        }}
      >
        <ResumeEditor />
      </ResumeConfigProvider>
    );

    expect(container.querySelector('.editor-sidebar')).toBeInTheDocument();
    expect(container.querySelector('.editor-main')).toBeInTheDocument();
  });
});
