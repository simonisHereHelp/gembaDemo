import React, { useState, useEffect } from 'react';
import Spacer from '@site/src/components/Spacer';
import styles from './styles.module.css';
import { requestOrientPermission, useOrientState } from '@site/src/components/useOrientState';

const OrientStateDisplay = () => {
  // Local state to track permission status.
  const [permission, setPermission] = useState(null);

  // Request sensor permission once on mount.
  useEffect(() => {
    requestOrientPermission().then((granted) => {
      setPermission(granted);
    });
  }, []);

  // Get the computed state from our custom hook.
  const stateValue = useOrientState();

  // If permission hasn't been granted yet, show a button.
  if (!permission) {
    return (
      <div className={styles.Container} style={{ height: 250 }}>
        <div style={{ position: 'relative', textAlign: 'left', width: 'max-content' }}>
          <h1 className={styles.HeaderTitle}>Orient State Utility</h1>
          <Spacer height={50} />
          <button
            onClick={() =>
              requestOrientPermission().then((granted) => {
                setPermission(granted);
              })
            }
          >
            Enable Sensors
          </button>
          <Spacer height={50} />
          <span>No sensor permission</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Container} style={{ height: 250 }}>
      <div style={{ position: 'relative', textAlign: 'left', width: 'max-content' }}>
        <h1 className={styles.HeaderTitle}>Orient State Utility</h1>
        <Spacer height={50} />
        <span>State = {stateValue !== null ? stateValue : 'No Data'}</span>
        <Spacer height={50} />
      </div>
    </div>
  );
};

export default OrientStateDisplay;
