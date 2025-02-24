import React, { useState, useEffect, useRef } from 'react';
import Spacer from '@site/src/components/Spacer';
import styles from './styles.module.css';

const HomepageHeader: React.FC = () => {
  // State variables for current state, absolute angle, and last motion timestamp.
  const [currentState, setCurrentState] = useState('_1');
  const [titleAngle, setTitleAngle] = useState(0);
  const [lastDeltaMotion, setLastDeltaMotion] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [sensorsEnabled, setSensorsEnabled] = useState(false);

  // More sensitive parameters (adjust as needed):
  const alpha = 0.1;
  const motionDeltaThreshold = 0.1; // Lower threshold for increased sensitivity.
  const motionTimeout = 300; // Device considered "moving" if motion detected within last 300ms.

  // Refs for low-pass filtering acceleration values.
  const filteredAcceleration = useRef({ x: 0, y: 0, z: 0 });
  const prevFilteredAcceleration = useRef({ x: 0, y: 0, z: 0 });

  // Function to request sensor permissions (necessary on some platforms, e.g. iOS).
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

  // Handle device motion: update lastDeltaMotion when significant motion is detected.
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

  // Handle device orientation: compute absolute angle (Metric A) adjusted for portrait vs. landscape.
  useEffect(() => {
    if (!sensorsEnabled) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let angle = 0;
      // Determine orientation mode using the Screen Orientation API or fallback.
      if (window.screen.orientation && window.screen.orientation.type) {
        if (window.screen.orientation.type.startsWith('landscape')) {
          // In landscape, use gamma.
          angle = Math.abs(event.gamma || 0);
        } else {
          // In portrait, use beta.
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

  // Define whether the device is considered "in motion" based on the motion timeout.
  const isMoving = lastDeltaMotion !== null && (currentTime - lastDeltaMotion < motionTimeout);

  // Determine state based on dual metrics:
  // 1) If not moving, state = _1.
  // 2) If moving and angle is between 30° and 70°, state = _3.
  // 3) If moving and angle is outside that range, state = _2.
  useEffect(() => {
    if (!isMoving) {
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
