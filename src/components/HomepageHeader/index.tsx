import React, { useState, useEffect, useRef } from 'react';
import Spacer from '@site/src/components/Spacer';
import styles from './styles.module.css';

const HomepageHeader: React.FC = () => {
  // State variables for device state, tilt angle, and sensor permission.
  const [currentState, setCurrentState] = useState('STATE_1');
  const [titleAngle, setTitleAngle] = useState(0);
  const [sensorsEnabled, setSensorsEnabled] = useState(false);

  // Refs to keep the current state accessible inside event handlers.
  const currentStateRef = useRef(currentState);
  useEffect(() => {
    currentStateRef.current = currentState;
  }, [currentState]);

  // Refs for filtering acceleration and for comparing consecutive readings.
  const filteredAcceleration = useRef({ x: 0, y: 0, z: 0 });
  const prevFilteredAcceleration = useRef({ x: 0, y: 0, z: 0 });

  // Motion detection parameters.
  const motionDeltaThreshold = 0.2; // Adjust this value based on testing.
  const alpha = 0.1; // Low-pass filter smoothing factor.

  // Request sensor permissions if needed (e.g., on iOS).
  const enableSensors = async () => {
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        if (response === 'granted') {
          setSensorsEnabled(true);
        } else {
          console.error('Permission not granted for DeviceMotionEvent');
        }
      } catch (error) {
        console.error('Error requesting sensor permission:', error);
      }
    } else {
      // Non-iOS or browsers that do not require permission.
      setSensorsEnabled(true);
    }
  };

  useEffect(() => {
    if (!sensorsEnabled) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        const { x, y, z } = event.accelerationIncludingGravity;
        if (x == null || y == null || z == null) return;

        // Update filtered acceleration with a low-pass filter.
        filteredAcceleration.current.x = alpha * x + (1 - alpha) * filteredAcceleration.current.x;
        filteredAcceleration.current.y = alpha * y + (1 - alpha) * filteredAcceleration.current.y;
        filteredAcceleration.current.z = alpha * z + (1 - alpha) * filteredAcceleration.current.z;

        // Compute the change (delta) from the previous filtered values.
        const delta = Math.sqrt(
          Math.pow(filteredAcceleration.current.x - prevFilteredAcceleration.current.x, 2) +
          Math.pow(filteredAcceleration.current.y - prevFilteredAcceleration.current.y, 2) +
          Math.pow(filteredAcceleration.current.z - prevFilteredAcceleration.current.z, 2)
        );

        // Save current filtered values for the next comparison.
        prevFilteredAcceleration.current = { ...filteredAcceleration.current };

        // Use the delta to decide if the device is moving.
        if (delta > motionDeltaThreshold) {
          // If movement is detected while in static state, update to STATE_2.
          if (currentStateRef.current === 'STATE_1') {
            setCurrentState('STATE_2');
          }
        } else {
          // If the delta is small, consider the device as static.
          if (currentStateRef.current !== 'STATE_1') {
            setCurrentState('STATE_1');
          }
        }
      }
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta;
      if (beta != null) {
        // Use the absolute value of beta as the tilt angle.
        const tiltAngle = Math.abs(beta);
        setTitleAngle(tiltAngle);

        // Only update state based on orientation when device is not static.
        if (currentStateRef.current !== 'STATE_1') {
          if (currentStateRef.current === 'STATE_2' && tiltAngle >= 20 && tiltAngle <= 60) {
            setCurrentState('STATE_3');
          } else if (currentStateRef.current === 'STATE_3' && (tiltAngle < 20 || tiltAngle > 60)) {
            setCurrentState('STATE_2');
          }
        }
      }
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion, false);
    } else {
      console.log('DeviceMotionEvent is not supported on your device/browser.');
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, false);
    } else {
      console.log('DeviceOrientationEvent is not supported on your device/browser.');
    }

    // Cleanup event listeners on component unmount.
    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleMotion);
      }
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [sensorsEnabled]);

  return (
    <div className={styles.Container} style={{ height: 250 }}>
      <div style={{ position: 'relative', textAlign: 'left', width: 'max-content' }}>
        <h1 className={styles.HeaderTitle}>Device Orientation Demo (deifferentials vs absolute)</h1>
        <Spacer height={50} />
        {!sensorsEnabled ? (
          <button onClick={enableSensors}>Enable Sensors</button>
        ) : (
          <>
            <span>State = {currentState}</span>
            <Spacer height={50} />
            <span>Angle = {titleAngle.toFixed(2)}°</span>
            <Spacer height={50} />
          </>
        )}
      </div>
    </div>
  );
};

export default HomepageHeader;
