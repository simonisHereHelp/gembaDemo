import React, { useState, useEffect, useRef } from 'react';
import Spacer from '@site/src/components/Spacer';
import styles from './styles.module.css';
import { TypeAnimation } from "react-type-animation";

const HeaderView: React.FC = () => {
  // React state to hold the current state value.
  const [currentState, setCurrentState] = useState('STATE_1');

  // A ref to keep the current state accessible inside event handlers.
  const currentStateRef = useRef(currentState);
  useEffect(() => {
    currentStateRef.current = currentState;
  }, [currentState]);

  // Ref for storing the filtered acceleration values.
  const filteredAcceleration = useRef({ x: 0, y: 0, z: 0 });

  // Constants for motion threshold and filter smoothing.
  const motionThreshold = 1.5;
  const alpha = 0.1;

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        const { x, y, z } = event.accelerationIncludingGravity;
        if (x == null || y == null || z == null) return;

        // Apply a low-pass filter to smooth out sensor noise.
        filteredAcceleration.current.x = alpha * x + (1 - alpha) * filteredAcceleration.current.x;
        filteredAcceleration.current.y = alpha * y + (1 - alpha) * filteredAcceleration.current.y;
        filteredAcceleration.current.z = alpha * z + (1 - alpha) * filteredAcceleration.current.z;

        const netAcceleration = Math.sqrt(
          filteredAcceleration.current.x ** 2 +
          filteredAcceleration.current.y ** 2 +
          filteredAcceleration.current.z ** 2
        );

        // Transition from STATE_1 (static) to STATE_2 (lifted up) if significant motion is detected.
        if (currentStateRef.current === 'STATE_1' && netAcceleration > motionThreshold) {
          setCurrentState('STATE_2');
        }
        // If motion drops below the threshold, revert back to STATE_1.
        else if ((currentStateRef.current === 'STATE_2' || currentStateRef.current === 'STATE_3') &&
                 netAcceleration < motionThreshold) {
          setCurrentState('STATE_1');
        }
      }
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta;
      if (beta != null) {
        // Use the absolute value of beta (front-back tilt) as the tilt angle.
        const tiltAngle = Math.abs(beta);

        // When in STATE_2, check if the tilt falls within 20°–60° to transition to STATE_3.
        if (currentStateRef.current === 'STATE_2' && tiltAngle >= 20 && tiltAngle <= 60) {
          setCurrentState('STATE_3');
        }
        // If the tilt moves outside the target range, revert to STATE_2.
        else if (currentStateRef.current === 'STATE_3' && (tiltAngle < 20 || tiltAngle > 60)) {
          setCurrentState('STATE_2');
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
  }, []);

  return (
    <div className={styles.Container} style={{ height: 250 }}>
      <div style={{ position: "relative", textAlign: "left", width: "max-content" }}>
        <h1 className={styles.HeaderTitle}>Device orientation demo.</h1>
        <Spacer height={50} />
        <span>State = {currentState}</span>
        <Spacer height={50} />
      </div>
    </div>
  );
};

export default HeaderView;
