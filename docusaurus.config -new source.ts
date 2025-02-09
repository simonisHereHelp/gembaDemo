import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: './.env.prod' })  
}
else //if environment is undefined - using swizzle
    require('dotenv').config({ path: './.env.local' }) 

const config: Config = {

  title: 'isHere',
  tagline: `transforming client's workforce through on-site certification`,
  url: 'https://ishere.help',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'isHere.help', // Usually your GitHub org/user name.
  projectName: 'marco-website', // Usually your repo name.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-4CJ8J3MNPP',
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/isHereKV.jpg',
    navbar: {
      title: 'On-Site Cert',
      logo: {
        alt: 'isHere',
        src: 'img/logo-lambda.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'badgeSidebar',
          label: 'Illustrations',
          position: 'left',
        },
        {
          type: 'doc',
          docId: 'aboutUs',
          label: 'About Us🙍🏽‍♂️',
          position: 'right',
        },
      ],
    },
    footer: {

        style: 'dark',
        links: [], // Removed all links
        copyright: `© ${new Date().getFullYear()} isHere.help | simon@ishere.help <br/> transforming client's workforce through on-site certification`,

    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      appId: '5OO1ZU522Y',
      apiKey: '1a657d79f462a65675d881b1cbf3a6d4',
      indexName: 'barklarm'
    }
  } satisfies Preset.ThemeConfig,
  scripts: [
  ],
};

export default config;
