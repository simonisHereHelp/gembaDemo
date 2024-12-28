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
        },
        gtag: {
          trackingID: 'G-999X9XX9XX', // Replace with your actual tracking ID
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/favicon.ico',
      navbar: {
        title: 'CertMe!',
        logo: {
          alt: 'Provisio',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Take Photos▶️',
          },
          {
            to: 'myphotos',
            position: 'left',
            label: 'Get Certified📂',
          },
          {
            to: 'my-wallet',
            position: 'left',
            label: 'My Certs Wallet🌠',
          },
          {
            type: 'dropdown',
            label: 'Cheat Sheets⚙️',
            position: 'right',
            items: [
              {
                type: 'doc',
                docId: 'avoid-these-errors',
                label: 'Avoid These Errors',
              },
              {
                type: 'doc',
                docId: 'wi2/scope',
                label: 'Choice of Adapters⚙️',
              },
            ],
          },
          {
            to: 'goodbye',
            position: 'left',
            label: 'Exit⏫',
          },
          {
            type: 'doc',
            docId: 'aboutProject/aboutUs/contactInfo',
            label: 'Talk to Tutor🙍🏽‍♂️',
            position: 'right',
          },
          {
            type: 'doc',
            docId: 'pricing', // Updated route
            label: 'Pricing⚙️',
            position: 'right',
          }
        ],
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
