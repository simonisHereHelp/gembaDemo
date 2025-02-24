import React, { useState } from 'react';
import Spacer from '@site/src/components/Spacer';
import styles from './styles.module.css';
import { requestOrientPermission, useOrientState } from '@site/src/components/useOrientState';

const HomepageHeader = () => {
  // Initially, permission is set to false.
  const [permission, setPermission] = useState(false);

  // Always call the custom hook to compute sensor state.
  const sensorState = useOrientState();

  // Handler for the button click to request permission.
  const handleRequestPermission = () => {
    requestOrientPermission().then((granted) => {
      setPermission(granted);
    });
  };

  return (
    <div className={styles.Container} style={{ height: 250 }}>
      <div style={{ position: 'relative', textAlign: 'left', width: 'max-content' }}>
        <h1 className={styles.HeaderTitle}>Device Orientation Demo v4</h1>
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
