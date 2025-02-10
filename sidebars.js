// @ts-check 

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  sidebarPractice: [
    {
      type: 'category',
      label: 'Session 7.1▶️',
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
      label: 'Session 7.2▶️',
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
    'wi2/scope',
  ],
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
    label: 'Training Materials',
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