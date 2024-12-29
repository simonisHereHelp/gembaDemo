import React, { useContext } from 'react';
import { GlobalPhotoContext } from '../../theme/Root'; // Adjust path based on your context file
import OriginalNavbarItem from '@theme-original/NavbarItem'; // Import the original NavbarItem component

const MyLoginItem = (props) => {
  const { LiveDetected } = useContext(GlobalPhotoContext);

  // Dynamically update the label based on LiveDetected state
  const dynamicLabel = LiveDetected ? 'Logged In' : 'Not Login';

  return <OriginalNavbarItem {...props} label={dynamicLabel} />;
};

export default MyLoginItem;
