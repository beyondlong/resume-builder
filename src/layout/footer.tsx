import { getSearchObj } from '@/helpers/location';
import { GithubFilled } from '@ant-design/icons';
import React from 'react';
import './footer.less';

const Footer: React.FC = () => {
  const user = getSearchObj().user || 'beyondlong';

  return (
    <footer>
      <div>
        <div>
          <span className="">Made with</span>
          <span className="author">
            by
            <span
              style={{ marginLeft: '4px', cursor: 'pointer' }}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.open(`https://github.com/${user}`);
                }
              }}
            >
              {user}
            </span>
          </span>
        </div>

        <a
          href={'https://github.com/beyondlong/resume-builder.git'}
          style={{ position: 'absolute', right: '8px', fontSize: '12px' }}
          target="_blank"
        >
          <GithubFilled style={{ color: '#fff', marginRight: '4px' }} />{' '}
          项目代码
        </a>
      </div>
    </footer>
  );
};

export default Footer;
