module.exports = {
  pathPrefix: '/resume-builder',
  siteMetadata: {
    title: 'Resume Generator',
    githubUrl: 'https://github.com/beyondlong/resume-builder.git',
    author: 'beyondlong',
    contact: 'https://github.com/beyondlong',
  },
  flags: {
    DEV_SSR: false,
  },
  plugins: [
    {
      // https://developers.google.com/analytics/devguides/collection/gtagjs?hl=zh_CN
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingIds: ['G-2K3PH6MKBG'],
      },
    },
    {
      resolve: 'gatsby-plugin-antd',
      options: {
        style: true,
      },
    },
    {
      resolve: 'gatsby-plugin-less',
      options: {
        javascriptEnabled: true,
        modifyVars: {
          'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          'primary-color': '#4f46e5',
          'border-radius-base': '8px',
          'card-radius': '12px',
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    'gatsby-plugin-pnpm',
  ],
};
