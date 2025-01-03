// @ts-check 

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  sidebarA: [
    {
      type: 'category',
      label: 'Video 7.1▶️',
      items: [
        'prov1',
        'prov2',
        'prov3',
        'prov4',
        'prov5',
        'prov6',
      ],
      collapsed: true,
    },
    
    {
      type: 'category',
      label: 'Video 7.2▶️',
      items: [
        'prov7',
        'prov8',
        'prov9',
        'prov10',
        'prov11',
        'prov12',
        'prov13',
      ],
      collapsed: true,
    },

    // Category for Document with nested References category
    {
      type: 'category',
      label: 'Document',
      items: [
        'wi1/wi-71',
        'wi1/wi-72',
        {
          type: 'category',
          label: 'References',
          items: [
            'wi2/min-0434-1',
          ],
        },
      ],
      collapsed: true,
    },
    'about-this-video',
    'wi2/scope',
  ],
  sidebarB: [
  'avoid-these-errors',
  'wi2/scope',
  {
    type: 'link',
    label: 'Gallery',
    href: '/gallery', // Adjust this path if necessary based on your site structure.
  },

  ],
  sidebarC: [
    'validate/validate-video',
    'validate/validate-kiosk',
    {
      type: 'category',
      label: 'About Our Work',
      items: [
        'scope-of-work',
        'our-workflow',
      ]},
    ],
};

export default sidebars;