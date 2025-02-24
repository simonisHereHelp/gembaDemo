import React, { useState, useEffect, useRef } from 'react';
import Spacer from '@site/src/components/Spacer';
import styles from './styles.module.css';

const HomepageHeader: React.FC = () => {
  // State variables for current state, absolute angle, and last motion timestamp.
  const [currentState, setCurrentState] = useState('_1');
  const [titleAngle, setTitleAngle] = useState(0);
  // Instead of a boolean, we store the timestamp (in ms) of the last detected motion.
  const [lastDeltaMotion, setLastDeltaMotion] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [sensorsEnabled, setSensorsEnabled] = useState(false);

  // Parameters for sensitivity.
  const alpha = 0.1;
  const motionDeltaThreshold = 0.1; // Lower threshold for increased sensitivity.
  const motionTimeout = 300; // Device is considered "in motion" if a motion event occurred within the last 300ms.

  // Refs for low-pass filtering acceleration values.
  const filteredAcceleration = useRef({ x: 0, y: 0, z: 0 });
  const prevFilteredAcceleration = useRef({ x: 0, y: 0, z: 0 });

  // Request sensor permissions (especially needed on iOS).
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
      setSensorsEnabled(true);
    }
  };

  // Update current time every 100ms for realtime calculations.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Handle device motion: update lastDeltaMotion timestamp when significant motion is detected.
  useEffect(() => {
    if (!sensorsEnabled) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        const { x, y, z } = event.accelerationIncludingGravity;
        if (x == null || y == null || z == null) return;

        // Update filtered acceleration using a low-pass filter.
        filteredAcceleration.current.x = alpha * x + (1 - alpha) * filteredAcceleration.current.x;
        filteredAcceleration.current.y = alpha * y + (1 - alpha) * filteredAcceleration.current.y;
        filteredAcceleration.current.z = alpha * z + (1 - alpha) * filteredAcceleration.current.z;

        // Compute the delta (Euclidean distance) between current and previous filtered values.
        const delta = Math.sqrt(
          Math.pow(filteredAcceleration.current.x - prevFilteredAcceleration.current.x, 2) +
          Math.pow(filteredAcceleration.current.y - prevFilteredAcceleration.current.y, 2) +
          Math.pow(filteredAcceleration.current.z - prevFilteredAcceleration.current.z, 2)
        );

        // Save current filtered values for the next comparison.
        prevFilteredAcceleration.current = { ...filteredAcceleration.current };

        // If the delta exceeds threshold, record the current time.
        if (delta > motionDeltaThreshold) {
          setLastDeltaMotion(Date.now());
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion, false);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [sensorsEnabled]);

  // Handle device orientation: compute absolute angle adjusted for portrait vs. landscape.
  useEffect(() => {
    if (!sensorsEnabled) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let angle = 0;
      // Use the Screen Orientation API (or fallback) to determine which angle to use.
      if (window.screen.orientation && window.screen.orientation.type) {
        if (window.screen.orientation.type.startsWith('landscape')) {
          // Landscape: use gamma.
          angle = Math.abs(event.gamma || 0);
        } else {
          // Portrait: use beta.
          angle = Math.abs(event.beta || 0);
        }
      } else {
        // Fallback using window.orientation.
        if (window.orientation === 90 || window.orientation === -90) {
          angle = Math.abs(event.gamma || 0);
        } else {
          angle = Math.abs(event.beta || 0);
        }
      }
      setTitleAngle(angle);
    };

    window.addEventListener('deviceorientation', handleOrientation, false);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [sensorsEnabled]);

  // Determine if the device is "moving" based on the time elapsed since the last motion.
  const isMoving = lastDeltaMotion !== null && (currentTime - lastDeltaMotion < motionTimeout);

  // Apply the new state logic:
  // 1) If angle < 5° and not moving, state_1.
  // 2) Otherwise, default to state_2.
  // 3) If in state_2 and angle is between 30° and 70°, override to state_3.
  useEffect(() => {
    if (!isMoving && titleAngle < 5) {
      setCurrentState('_1');
    } else {
      if (titleAngle >= 30 && titleAngle <= 70) {
        setCurrentState('_3');
      } else {
        setCurrentState('_2');
      }
    }
  }, [isMoving, titleAngle]);

  return (
    <div className={styles.Container} style={{ height: 250 }}>
      <div style={{ position: 'relative', textAlign: 'left', width: 'max-content' }}>
        <h1 className={styles.HeaderTitle}>Device Orientation Demo v4</h1>
        <Spacer height={50} />
        {!sensorsEnabled ? (
          <button onClick={enableSensors}>Enable Sensors</button>
        ) : (
          <>
            <span>State = {currentState}</span>
            <Spacer height={50} />
            <span>
              Motioned ={' '}
              {lastDeltaMotion
                ? `${(currentTime - lastDeltaMotion).toFixed(0)} ms since last motion`
                : 'null'}
            </span>
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
