/**
 * 主题预设配置
 */
export type ThemePreset = {
  id: string;
  name: string;
  gradientStart: string;
  gradientEnd: string;
  color: string;
  tagColor: string;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'purple-blue',
    name: 'purpleBlue',
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    color: '#667eea',
    tagColor: '#8b5cf6',
  },
  {
    id: 'blue',
    name: 'blue',
    gradientStart: '#0052D4',
    gradientEnd: '#4364F7',
    color: '#0052D4',
    tagColor: '#3B82F6',
  },
  {
    id: 'light-blue',
    name: 'lightBlue',
    gradientStart: '#60A5FA',
    gradientEnd: '#3B82F6',
    color: '#60A5FA',
    tagColor: '#93C5FD',
  },
  {
    id: 'green',
    name: 'green',
    gradientStart: '#2ECC71',
    gradientEnd: '#27AE60',
    color: '#2ECC71',
    tagColor: '#10B981',
  },
  {
    id: 'cyan',
    name: 'cyan',
    gradientStart: '#27BAB5',
    gradientEnd: '#1BA39C',
    color: '#27BAB5',
    tagColor: '#14B8A6',
  },
];
