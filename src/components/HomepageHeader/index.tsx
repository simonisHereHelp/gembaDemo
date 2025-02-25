import React, { useState } from 'react';
import Spacer from '@site/src/components/Spacer';
import styles from './styles.module.css';
import { requestMotionPermission, useMotionState } from '@site/src/components/useMotionTracker';

const HomepageHeader = () => {
  // Initially, permission is set to false.
  const [permission, setPermission] = useState(false);

  // Always call the custom hook to compute sensor state.
  const sensorState = useMotionState();

  // Handler for the button click to request permission.
  const handleRequestPermission = () => {
    requestMotionPermission().then((granted) => {
      setPermission(granted);
    });
  };

  return (
    <div className={styles.Container} style={{ height: 250 }}>
      <div style={{ position: 'relative', textAlign: 'left', width: 'max-content' }}>
        <h1 className={styles.HeaderTitle}>Motion Tracker Demo v5</h1>
        <Spacer height={50} />
        {permission ? (
          <span>State = {sensorState !== null ? sensorState : 'No Data'}</span>
        ) : (
          <>
            <button onClick={handleRequestPermission}>
              Activate Motion Tracking
            </button>
            <Spacer height={50} />
            <span>Sensor permission required</span>
          </>
        )}
        <Spacer height={50} />
      </div>
    </div>
  );
};

export default HomepageHeader;
