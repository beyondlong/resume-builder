import React, { useState } from 'react';
import { Upload, Avatar as AntdAvatar } from 'antd';
import { resolveStaticAssetUrl } from '@/helpers/browser-compat';
import './index.less';

export const Avatar = ({
  avatarSrc,
  className,
  shape = 'circle',
  size = 'default',
}) => {
  const resolvedAvatarSrc = resolveStaticAssetUrl(avatarSrc);

  return (
    <div className={`avatar ${!resolvedAvatarSrc ? 'avatar-hidden' : ''}`}>
      {resolvedAvatarSrc ? (
        // @ts-ignore
        <AntdAvatar
          className={className}
          src={resolvedAvatarSrc}
          shape={shape as any}
          size={size as any}
        />
      ) : (
        <span className="avatar-upload-tip">头像地址为空</span>
      )}
    </div>
  );
};
