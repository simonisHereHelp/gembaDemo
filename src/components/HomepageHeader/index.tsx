import React, { useState, useEffect, useRef } from 'react';
import Spacer from '@site/src/components/Spacer';
import styles from './styles.module.css';

const HomepageHeader: React.FC = () => {
  // State variables for device state, tilt angle, and sensor permission.
  const [currentState, setCurrentState] = useState('STATE_1');
  const [titleAngle, setTitleAngle] = useState(0);
  const [sensorsEnabled, setSensorsEnabled] = useState(false);

  // Refs to hold state inside event handlers.
  const currentStateRef = useRef(currentState);
  useEffect(() => {
    currentStateRef.current = currentState;
  }, [currentState]);

  // Ref for storing filtered acceleration.
  const filteredAcceleration = useRef({ x: 0, y: 0, z: 0 });

  // Constants for motion detection and filtering.
  const motionThreshold = 1.5;
  const alpha = 0.1;

  // Function to request sensor permissions (required on iOS).
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
      // For non-iOS devices or browsers not requiring permission.
      setSensorsEnabled(true);
    }
  };

  useEffect(() => {
    if (!sensorsEnabled) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        const { x, y, z } = event.accelerationIncludingGravity;
        if (x == null || y == null || z == null) return;

        // Apply a low-pass filter to smooth sensor noise.
        filteredAcceleration.current.x = alpha * x + (1 - alpha) * filteredAcceleration.current.x;
        filteredAcceleration.current.y = alpha * y + (1 - alpha) * filteredAcceleration.current.y;
        filteredAcceleration.current.z = alpha * z + (1 - alpha) * filteredAcceleration.current.z;

        // Compute the magnitude of the filtered acceleration.
        const netAcceleration = Math.sqrt(
          filteredAcceleration.current.x ** 2 +
          filteredAcceleration.current.y ** 2 +
          filteredAcceleration.current.z ** 2
        );

        // Transition from STATE_1 (static) to STATE_2 (lifted) if motion exceeds threshold.
        if (currentStateRef.current === 'STATE_1' && netAcceleration > motionThreshold) {
          setCurrentState('STATE_2');
        }
        // Revert to STATE_1 if motion drops below the threshold.
        else if (
          (currentStateRef.current === 'STATE_2' || currentStateRef.current === 'STATE_3') &&
          netAcceleration < motionThreshold
        ) {
          setCurrentState('STATE_1');
        }
      }
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta;
      if (beta != null) {
        // Calculate the absolute tilt angle from the beta value.
        const tiltAngle = Math.abs(beta);
        setTitleAngle(tiltAngle);

        // When in STATE_2, if tilt is between 20° and 60°, transition to STATE_3.
        if (currentStateRef.current === 'STATE_2' && tiltAngle >= 20 && tiltAngle <= 60) {
          setCurrentState('STATE_3');
        }
        // If the tilt moves out of that range, revert to STATE_2.
        else if (currentStateRef.current === 'STATE_3' && (tiltAngle < 20 || tiltAngle > 60)) {
          setCurrentState('STATE_2');
        }
      }
    };

    // Register event listeners.
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

    // Cleanup event listeners on unmount.
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
        <h1 className={styles.HeaderTitle}>Device Orientation Demo</h1>
        <Spacer height={50} />
        { !sensorsEnabled ? (
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
