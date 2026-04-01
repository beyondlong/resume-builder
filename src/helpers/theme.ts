import type { ThemeConfig } from '@/components/types';

export const DEFAULT_THEME: ThemeConfig = {
  color: '#2f5785',
  tagColor: '#2f5785',
};

export const PRESET_THEME_COLORS = [
  '#2f5785',
  '#1f7a8c',
  '#198754',
  '#c86b1f',
  '#8f3d5e',
  '#4f46e5',
  '#374151',
  '#b91c1c',
];

export const buildThemeConfig = (color?: string | null): ThemeConfig => {
  const normalizedColor = color || DEFAULT_THEME.color;

  return {
    color: normalizedColor,
    tagColor: normalizedColor,
  };
};

export const normalizeThemeConfig = (
  theme?: Partial<ThemeConfig> | null
): ThemeConfig => {
  if (!theme) {
    return DEFAULT_THEME;
  }

  return {
    color: theme.color || DEFAULT_THEME.color,
    tagColor: theme.tagColor || theme.color || DEFAULT_THEME.tagColor,
  };
};
