import { ColorPicker } from '@/components/FormCreator/ColorPicker';
import type { ThemeConfig } from '@/components/types';
import { PRESET_THEME_COLORS } from '@/helpers/theme';
import { Button } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';

type Props = {
  currentTheme: ThemeConfig;
  isDefaultTheme: boolean;
  onThemeChange: (color: string) => void;
  onThemeReset: () => void;
};

export const ThemeSettingsPanel: React.FC<Props> = ({
  currentTheme,
  isDefaultTheme,
  onThemeChange,
  onThemeReset,
}) => (
  <div className="theme-settings-panel">
    <div className="theme-settings-preview">
      <span className="theme-settings-label">
        <FormattedMessage id="当前主色" />
      </span>
      <div className="theme-settings-preview-value">
        <span
          className="theme-settings-preview-chip"
          style={{ backgroundColor: currentTheme.color }}
        />
        <code>{currentTheme.color}</code>
      </div>
    </div>
    <div className="theme-settings-row">
      <span className="theme-settings-label">
        <FormattedMessage id="主题色" />
      </span>
      <ColorPicker
        value={currentTheme.color}
        onChange={onThemeChange}
        className="theme-settings-picker"
        style={{ width: 28, height: 28, borderRadius: 999 }}
      />
    </div>
    <div className="theme-settings-presets">
      <div className="theme-settings-label">
        <FormattedMessage id="预设主题" />
      </div>
      <div className="theme-settings-swatch-list">
        {PRESET_THEME_COLORS.map(color => {
          const isActive = currentTheme.color === color;

          return (
            <button
              key={color}
              type="button"
              className={`theme-settings-swatch${isActive ? ' is-active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => onThemeChange(color)}
              aria-label={`theme-${color}`}
            />
          );
        })}
      </div>
    </div>
    <Button size="small" onClick={onThemeReset} disabled={isDefaultTheme}>
      <FormattedMessage id="恢复默认" />
    </Button>
  </div>
);
