import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Operators Certified!',
  tagline: 'Functional videos!',
  favicon: 'img/favicon.ico',
  // Set the production url of your site here
  url: 'https://www.ishere.help/',

  baseUrl: '/',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

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
          customCss: './src/css/custom.css',
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
        title: 'Restricted Gemba',
        logo: {
          alt: 'Star Trainers',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'sidebarA',
            position: 'left',
            label: 'Trainers',
            className: 'navbar-prime',
          },
          {
            to: 'myphotos',
            position: 'left',
            label: 'On-Site Certification',
            className: 'navbar-prime',
          },
          {
            to: 'my-wallet',
            position: 'left',
            label: 'Instructor Logs',
            className: 'navbar-prime',
          },
          {
            type: 'docSidebar',
            sidebarId: 'sidebarB',
            label: 'Resources',
            position: 'right',
            className: 'navbar-left',
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
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
