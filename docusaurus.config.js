import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Operators Certified!',
  tagline: 'Functional videos!',
  favicon: 'img/favicon.ico',
  // Set the production url of your site here
  url: 'https://www.ishere.help/',

  baseUrl: '/',
  organizationName: 'ishere.help', // Usually your GitHub org/user name.
  projectName: 'on-site', // Usually your repo name.

  onBrokenLinks: 'log', // Change 'throw' to 'log' to avoid crashes on broken links
  onBrokenMarkdownLinks: 'warn',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      
      ({
        docs: {
          sidebarPath: './sidebars.js',

        },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/custom_responsive.css'),
          ],
        }
      }),
    ],
  ],

  
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/favicon.ico',
      navbar: {
        title: 'Xperts On-Site',
        logo: {
          alt: 'Star Trainers',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'sidebarInstruct',
            label: 'Instructions',
            position: 'left',
            className: 'navbar-prime',
          },
          {
            type: 'docSidebar',
            sidebarId: 'sidebarPractice',
            position: 'left',
            label: 'Practice',
            className: 'navbar-prime',
          },
          {
            to: 'myphotos',
            position: 'left',
            label: 'Certification',
            className: 'navbar-prime',
          },
          {
            to: 'my-wallet',
            position: 'right',
            label: 'Learning Log',
            className: 'navbar-prime',
          },
          {
            type: 'docSidebar',
            sidebarId: 'sidebarD',
            label: 'Support & Guidance',
            position: 'right',
            className: 'navbar-left',
          },
          {
            to: 'goodbye',
            position: 'right',
            label: 'End Training',
            className: 'navbar-right',
          },
          // {
          //   type: 'doc',
          //   docId: 'pricing', // Updated route
          //   label: 'Pricing',
          //   position: 'right',
          //   className: 'navbar-right',
          // },
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'sidebarC',
          //   label: 'Validation',
          //   position: 'right',
          //   className: 'navbar-right',
          // },
        ],
      },
      typography: {
        fontFamily: "'Roboto', sans-serif",
        fontSize: "16px",
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
