// @ts-check 

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  sidebarInstruct: [
  {type: 'category',
    label: 'Live Training',
    items: [
      { 
        type: 'doc',
        id: 'instructor_profile', 
        label: 'Instructor' 
      }
    ],
      collapsed: false
   },
  {
    type: 'category',
    label: 'Series 7',
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
    collapsed: false,
  },
  {
    type: 'category',
    label: 'Series 8 (IVL)',
    items: [
      {
        type: 'doc',
        label: 'IVL™ Catheter Assembly', // Label for the link
        id: 'wi2/min0434C', // Path to the document in your docs folder
      },
    ],
    collapsed: false,
  },
  {
    type: 'doc',
    label: 'Avoid These Errors', // Label for the link
    id: 'avoid-these-errors', // Path to the document in your docs folder
  },
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
  sidebarD: [
    {
      type: 'doc',
      id: 'aboutProject/aboutUs/contactInfo', // Path to the document in your docs folder
      label: 'Talk to Tutor', // Display name for the link
    },
    {
      type: 'link',
      label: 'Access My Screen (allow Live)', // Label for the link
      href: '/remoteAccess', // Path to the remoteAccess page
    },
    {
      type: 'link',
      label: 'Set Up Cameras', // Label for the link
      href: '/setupWebcam', // Path to the SetupWebcam page
    },
      ],
};

export default sidebars;