let LiveDetected = false; // Set the initial state

// Utility function to get navbar items
const NavBarItems = () => [
  {
    type: 'docSidebar',
    sidebarId: 'tutorialSidebar',
    position: 'left',
    label: 'Take2 Photos▶️', // Dynamic label
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
    docId: 'pricing',
    label: 'Pricing⚙️',
    position: 'right',
  },
];

// Export the function
export const setLiveDetected = (value) => {
  LiveDetected = value;
};

export default NavBarItems;
