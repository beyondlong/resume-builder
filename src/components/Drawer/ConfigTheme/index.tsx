import { FormattedMessage, useIntl } from 'react-intl';
import React, { useEffect } from 'react';
import { ColorPicker } from '../../FormCreator/ColorPicker';
import type { ThemeConfig } from '../../types';
import { THEME_PRESETS, type ThemePreset } from '@/data/themePresets';

type Props = ThemeConfig & {
  onChange: (v: Partial<ThemeConfig>) => void;
};

const FormItemStyle = {
  display: 'flex',
  alignItems: 'center',
  minWidth: '100px',
};

export const ConfigTheme: React.FC<Props> = props => {
  const intl = useIntl();

  useEffect(() => {
    let $style = document.getElementById('dynamic');
    if (!$style) {
      $style = document.createElement('style');
      $style.setAttribute('id', 'dynamic');
      document.head.insertBefore($style, null);
    }
    // 根据当前主题色查找对应的预设
    const currentPreset = THEME_PRESETS.find(p => p.color === props.color) || THEME_PRESETS[0];
    const styles = `
      :root {
        --primary-color: ${props.color};
        --tag-color: ${props.tagColor};
        --gradient-start: ${currentPreset.gradientStart};
        --gradient-end: ${currentPreset.gradientEnd};
      }

      /* 渐变背景应用 */
      header, .preview-header, footer > div {
        background: linear-gradient(135deg, ${currentPreset.gradientStart} 0%, ${currentPreset.gradientEnd} 100%) !important;
      }

      .preview-page {
        background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
      }

      .resume-editor {
        background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
      }

      .module-item:hover {
        background: linear-gradient(135deg, ${currentPreset.gradientStart}20 0%, ${currentPreset.gradientEnd}20 100%) !important;
      }

      .module-item.selected {
        background: linear-gradient(135deg, ${currentPreset.gradientStart} 0%, ${currentPreset.gradientEnd} 100%) !important;
        box-shadow: 0 4px 15px ${currentPreset.gradientStart}66 !important;
      }

      .module-item .module-icon {
        color: ${currentPreset.gradientStart} !important;
      }

      .add-btn {
        color: ${currentPreset.gradientStart} !important;
        border-color: ${currentPreset.gradientStart} !important;
      }

      .add-btn:hover {
        color: ${currentPreset.gradientEnd} !important;
        border-color: ${currentPreset.gradientEnd} !important;
        background: ${currentPreset.gradientStart}0D !important;
      }

      .drop-over-downward, .drop-over-upward {
        border-color: ${currentPreset.gradientStart} !important;
      }

      .edit-form-container {
        box-shadow: 0 2px 12px ${currentPreset.gradientStart}26 !important;
      }
    `;
    $style.innerHTML = styles;
  }, [props.color, props.tagColor]);

  const handlePresetSelect = (preset: ThemePreset) => {
    props.onChange({
      color: preset.color,
      tagColor: preset.tagColor,
    });
  };

  return (
    <div>
      {/* 主题预设选择 */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '8px', fontSize: '13px', color: 'rgba(0,0,0,0.45)' }}>
          <FormattedMessage id="主题风格" />
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {THEME_PRESETS.map(preset => (
            <div
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${preset.gradientStart} 0%, ${preset.gradientEnd} 100%)`,
                cursor: 'pointer',
                border: props.color === preset.color ? '3px solid #000' : '3px solid transparent',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
              title={intl.formatMessage({ id: preset.name })}
            />
          ))}
        </div>
      </div>

      {/* 颜色选择器 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={FormItemStyle}>
          <span style={{ marginRight: '4px' }}>
            <FormattedMessage id="主题色" />
          </span>
          <ColorPicker
            value={props.color}
            onChange={v => props.onChange({ color: v })}
          />
        </div>
        <div style={FormItemStyle}>
          <span style={{ marginRight: '4px' }}>
            <FormattedMessage id="Tag 标签色" />
          </span>
          <ColorPicker
            value={props.tagColor}
            onChange={v => props.onChange({ tagColor: v })}
          />
        </div>
      </div>
    </div>
  );
};
