import PreviewPage from '@/pages/preview';
import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('gatsby', () => ({
  Link: ({
    children,
    to,
    className,
  }: {
    children: React.ReactNode;
    to: string;
    className?: string;
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

jest.mock('react-helmet', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/Resume', () => ({
  Resume: () => <div data-testid="resume-preview" />,
}));

jest.mock('@/components/AIMockInterview', () => ({
  AIMockInterview: () => (
    <button type="button" className="ai-tool-trigger ai-tool-trigger--preview">
      AI Mock Interview
    </button>
  ),
}));

jest.mock('@/components/FormCreator/ColorPicker', () => ({
  ColorPicker: () => <div data-testid="color-picker" />,
}));

jest.mock('@/helpers/export-to-local', () => ({
  exportDataToLocal: jest.fn(),
}));

jest.mock('@/helpers/browser-compat', () => ({
  shouldUsePrintPopupFallback: jest.fn(() => false),
}));

jest.mock('@/helpers/location', () => ({
  buildLocalizedPath: jest.fn(() => '/'),
}));

jest.mock('@/helpers/storage', () => ({
  loadFromStorage: jest.fn(() => ({})),
  saveToStorage: jest.fn(),
}));

jest.mock('@/helpers/resume-config', () => ({
  loadResolvedResumeConfig: jest.fn(() => ({
    profile: {
      name: 'Preview User',
    },
  })),
}));

jest.mock('@/helpers/theme', () => ({
  DEFAULT_THEME: {
    color: '#4f46e5',
    tagColor: '#4f46e5',
  },
  PRESET_THEME_COLORS: ['#4f46e5', '#2563eb'],
  buildThemeConfig: jest.fn((color: string) => ({
    color,
    tagColor: color,
  })),
  normalizeThemeConfig: jest.fn(theme => ({
    color: theme?.color || '#4f46e5',
    tagColor: theme?.tagColor || theme?.color || '#4f46e5',
  })),
}));

jest.mock('@/i18n', () => ({
  getLanguage: jest.fn(() => 'en-US'),
  getLocale: jest.fn(() => ({
    返回编辑: 'Back to edit',
    主题设置: 'Theme Settings',
    导出配置: 'Export Config',
    '下载 PDF': 'Download PDF',
    当前主色: 'Current Color',
    主题色: 'Theme',
    预设主题: 'Presets',
    恢复默认: 'Reset',
    现代简洁模板: 'Modern',
    经典模板: 'Classic',
    简易模板: 'Simple',
    多页模板: 'Multi Page',
    商务模板: 'Business',
    设计感杂志模板: 'Editorial',
    技术极客模板: 'Developer',
    暂无配置数据: 'No config',
  })),
  registerLocale: jest.fn(),
}));

describe('PreviewPage', () => {
  it('renders grouped action items for responsive preview controls', async () => {
    const { container } = render(<PreviewPage />);

    expect(await screen.findByTestId('resume-preview')).toBeInTheDocument();
    expect(container.querySelectorAll('.preview-action-item')).toHaveLength(5);
    expect(
      container.querySelector('.preview-action-item--select')
    ).toBeInTheDocument();
  });
});
