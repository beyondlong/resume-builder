import Footer from '@/layout/footer';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

describe('Footer', () => {
  it('renders localized project code link text', () => {
    window.history.replaceState({}, '', '/?lang=en-US');

    render(
      <IntlProvider
        locale="en-US"
        messages={{
          项目代码: 'Project Code',
        }}
      >
        <Footer />
      </IntlProvider>
    );

    expect(screen.getByText('Project Code')).toBeInTheDocument();
  });
});
