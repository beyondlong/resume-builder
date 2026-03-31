import React from 'react';
import { Link } from 'gatsby';

const NotFoundPage: React.FC = () => {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '12px',
        background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
        color: '#2f3640',
      }}
    >
      <h1 style={{ margin: 0 }}>404</h1>
      <p style={{ margin: 0 }}>页面不存在</p>
      <Link to="/">返回编辑页</Link>
    </main>
  );
};

export default NotFoundPage;
