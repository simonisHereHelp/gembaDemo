import React, { useState, useEffect, useRef } from 'react';
import Spacer from '@site/src/components/Spacer';
import styles from './styles.module.css';

const HomepageHeader: React.FC = () => {
  // State variables
  const [currentState, setCurrentState] = useState('_1');
  const [titleAngle, setTitleAngle] = useState(0);
  // Instead of a boolean for motion, we store the timestamp (in ms) of the last motion.
  const [lastDeltaMotion, setLastDeltaMotion] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [sensorsEnabled, setSensorsEnabled] = useState(false);

  // Constants for motion filtering and timeout (in ms)
  const alpha = 0.1;
  const motionDeltaThreshold = 0.2; // Change in acceleration to trigger motion
  const motionTimeout = 500; // Consider the device moving if the last motion was within 500ms

  // Refs for filtered acceleration values
  const filteredAcceleration = useRef({ x: 0, y: 0, z: 0 });
  const prevFilteredAcceleration = useRef({ x: 0, y: 0, z: 0 });

  // Request sensor permissions if needed (e.g., on iOS)
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

  // Update current time every 100ms for realtime display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Handle device motion: compute delta and update lastDeltaMotion timestamp if above threshold.
  useEffect(() => {
    if (!sensorsEnabled) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        const { x, y, z } = event.accelerationIncludingGravity;
        if (x == null || y == null || z == null) return;

        // Low-pass filter update.
        filteredAcceleration.current.x = alpha * x + (1 - alpha) * filteredAcceleration.current.x;
        filteredAcceleration.current.y = alpha * y + (1 - alpha) * filteredAcceleration.current.y;
        filteredAcceleration.current.z = alpha * z + (1 - alpha) * filteredAcceleration.current.z;

        // Compute delta (difference) from previous filtered values.
        const delta = Math.sqrt(
          Math.pow(filteredAcceleration.current.x - prevFilteredAcceleration.current.x, 2) +
          Math.pow(filteredAcceleration.current.y - prevFilteredAcceleration.current.y, 2) +
          Math.pow(filteredAcceleration.current.z - prevFilteredAcceleration.current.z, 2)
        );

        // Update previous filtered values.
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

  // Handle device orientation: compute the absolute angle adjusted for orientation mode.
  useEffect(() => {
    if (!sensorsEnabled) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let angle = 0;
      // Determine orientation mode (portrait vs. landscape)
      if (window.screen.orientation && window.screen.orientation.type) {
        if (window.screen.orientation.type.startsWith('landscape')) {
          // In landscape mode, use gamma.
          angle = Math.abs(event.gamma || 0);
        } else {
          // In portrait mode, use beta.
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

  // Compute isMoving based on lastDeltaMotion and current time.
  const isMoving = lastDeltaMotion !== null && (currentTime - lastDeltaMotion < motionTimeout);

  // Update state based on dual metrics:
  // A = titleAngle; B = isMoving.
  useEffect(() => {
    if (!isMoving && titleAngle < 2) {
      setCurrentState('_1');
    } else if (isMoving && titleAngle > 30 && titleAngle < 70) {
      setCurrentState('_3');
    } else if (isMoving) {
      setCurrentState('_2');
    }
  }, [isMoving, titleAngle]);

  return (
    <div className={styles.Container} style={{ height: 250 }}>
      <div style={{ position: 'relative', textAlign: 'left', width: 'max-content' }}>
        <h1 className={styles.HeaderTitle}>Device Orientation Demo</h1>
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
