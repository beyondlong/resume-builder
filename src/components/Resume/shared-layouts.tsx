import React from 'react';
import { Badge, Card } from 'antd';
import cx from 'classnames';

export const Template1FeatureSection: React.FC<{
  id?: string;
  title: React.ReactNode;
  color: string;
  children: React.ReactNode;
}> = ({ id, title, color, children }) => (
  <section>
    <div className="section-header">
      {id && <img src={`images/${id}.png`} alt="" width="26px" height="26px" />}
      <h1 style={{ background: color }}>{title}</h1>
    </div>
    <div className="section-body">{children}</div>
  </section>
);

export const Template2Section: React.FC<{
  className?: string;
  title: React.ReactNode;
  color: string;
  children: React.ReactNode;
}> = ({ className, title, color, children }) => (
  <div className={cx('section', className)}>
    <div className="section-title" style={{ color: color || '#000' }}>
      <span className="title">{title}</span>
      <span className="title-addon" />
    </div>
    <div className="section-body">{children}</div>
  </div>
);

export const Template3FeatureSection: React.FC<{
  title: React.ReactNode;
  color: string;
  children: React.ReactNode;
}> = ({ title, color, children }) => (
  <section>
    <div className="section-header">
      <h1 style={{ background: color }}>{title}</h1>
    </div>
    <div className="section-body">{children}</div>
  </section>
);

export const Template3CardSection: React.FC<{
  title: React.ReactNode;
  color: string;
  className?: string;
  children: React.ReactNode;
}> = ({ title, color, className, children }) => (
  <Badge.Ribbon
    text={<div className="section-title">{title}</div>}
    color={color || '#000'}
    placement="start"
  >
    <Card className={className}>{children}</Card>
  </Badge.Ribbon>
);

export const ModernSection: React.FC<{
  title: React.ReactNode;
  color: string;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}> = ({ title, color, className, contentClassName, children }) => (
  <section className={cx('section', className)}>
    <h2 className="section-title" style={{ color }}>
      {title}
    </h2>
    <div className={cx('section-content', contentClassName)}>{children}</div>
  </section>
);

export const ClickableText: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ onClick, children, className }) => (
  <span className={className} style={{ cursor: 'pointer' }} onClick={onClick}>
    {children}
  </span>
);
