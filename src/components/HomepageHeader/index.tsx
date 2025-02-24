import React, { useEffect, useState } from 'react';
import Spacer from '@site/src/components/Spacer';
import styles from './styles.module.css';
import { requestOrientPermission, useOrientState } from '@site/src/components/useOrientState';

const HomepageHeader = () => {
  const [permission, setPermission] = useState(null);

  // Request sensor permission on mount.
  useEffect(() => {
    requestOrientPermission().then((granted) => {
      setPermission(granted);
    });
  }, []);

  // If permission is not granted, show a button for the user to authorize.
  if (!permission) {
    return (
      <div className={styles.Container} style={{ height: 250 }}>
        <div style={{ position: 'relative', textAlign: 'left', width: 'max-content' }}>
          <h1 className={styles.HeaderTitle}>Orient State Utility</h1>
          <Spacer height={50} />
          <div>
            <button
              onClick={() =>
                requestOrientPermission().then((granted) => {
                  setPermission(granted);
                })
              }
            >
              Start Gyroscope Now...
            </button>
          </div>
          <Spacer height={50} />
          <span>No sensor permission</span>
        </div>
      </div>
    );
  }

  // Get the computed state from our custom hook.
  const stateValue = useOrientState();

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

export default HomepageHeader
