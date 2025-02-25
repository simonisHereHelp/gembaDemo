import { useState, useEffect, useRef } from 'react';

const DEFAULT_MOTION_TIMEOUT = 300; // in ms
const ALPHA = 0.1; // Low-pass filter smoothing factor
const MOTION_DELTA_THRESHOLD = 0.1; // Threshold for motion detection

let permissionRequested = false;
let permissionGranted = false;

let debugCount = 0;
function debugLog(...args) {
  if (debugCount < 6) {
    console.log(...args);
    debugCount++;
  }
}

/**
 * Requests permission for device motion/orientation events.
 * Returns a Promise that resolves to true if permission is granted (or not required).
 */
export async function requestMotionPermission() {
  if (!permissionRequested) {
    permissionRequested = true;
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        permissionGranted = response === 'granted';
        debugLog('Permission response:', response);
      } catch (error) {
        console.error('Error requesting sensor permission:', error);
        permissionGranted = false;
      }
    } else {
      permissionGranted = true;
      debugLog('Permission not required; automatically granted.');
    }
  }
  return permissionGranted;
}

/**
 * Custom hook that sets up sensor listeners to compute the motion state.
 * Additionally, it plays a sound effect when the state transitions to 2.
 *
 * Accepts:
 *   enabled (boolean) – whether sensor tracking is enabled.
 *
 * Returns an object with:
 *   sensorState: 1 if not moving and angle < 5°, 3 if moving and angle between 30°–70°, 2 otherwise,
 *   angle: the computed absolute angle,
 *   lastDeltaMotion: timestamp (ms) of the last significant motion,
 *   currentTime: current time (ms).
 */
export function useMotionState(enabled) {
  const [sensorState, setSensorState] = useState(null);
  const [angle, setAngle] = useState(null);
  const [lastDeltaMotion, setLastDeltaMotion] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [sensorsEnabled, setSensorsEnabled] = useState(enabled);

  // Update sensorsEnabled whenever the enabled prop changes.
  useEffect(() => {
    setSensorsEnabled(enabled);
  }, [enabled]);

  // Refs for low-pass filtering acceleration values.
  const filteredAcceleration = useRef({ x: 0, y: 0, z: 0 });
  const prevFilteredAcceleration = useRef({ x: 0, y: 0, z: 0 });

  // Audio ref for the scanning sound effect (client only).
  const audioRef = useRef(null);
  // Ref to track previous sensor state.
  const prevStateRef = useRef(null);

  // Initialize the Audio object on the client.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sonar.mp3');
    }
  }, []);

  // Update current time every 100ms.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Device motion: compute filtered acceleration and delta.
  useEffect(() => {
    if (!sensorsEnabled) return;

    const handleMotion = (event) => {
      if (event.accelerationIncludingGravity) {
        const { x, y, z } = event.accelerationIncludingGravity;
        if (x == null || y == null || z == null) return;
        filteredAcceleration.current.x = ALPHA * x + (1 - ALPHA) * filteredAcceleration.current.x;
        filteredAcceleration.current.y = ALPHA * y + (1 - ALPHA) * filteredAcceleration.current.y;
        filteredAcceleration.current.z = ALPHA * z + (1 - ALPHA) * filteredAcceleration.current.z;
        const delta = Math.sqrt(
          Math.pow(filteredAcceleration.current.x - prevFilteredAcceleration.current.x, 2) +
          Math.pow(filteredAcceleration.current.y - prevFilteredAcceleration.current.y, 2) +
          Math.pow(filteredAcceleration.current.z - prevFilteredAcceleration.current.z, 2)
        );
        prevFilteredAcceleration.current = { ...filteredAcceleration.current };
        if (delta > MOTION_DELTA_THRESHOLD) {
          setLastDeltaMotion(Date.now());
          debugLog('Motion delta exceeded:', delta);
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion, false);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [sensorsEnabled]);

  // Device orientation: compute the absolute angle.
  useEffect(() => {
    if (!sensorsEnabled) return;
    const handleOrientation = (event) => {
      let computedAngle = 0;
      if (window.screen.orientation && window.screen.orientation.type) {
        if (window.screen.orientation.type.startsWith('landscape')) {
          computedAngle = Math.abs(event.gamma || 0);
        } else {
          computedAngle = Math.abs(event.beta || 0);
        }
      } else {
        if (window.orientation === 90 || window.orientation === -90) {
          computedAngle = Math.abs(event.gamma || 0);
        } else {
          computedAngle = Math.abs(event.beta || 0);
        }
      }
      setAngle(computedAngle);
      debugLog('Computed angle:', computedAngle);
    };
    window.addEventListener('deviceorientation', handleOrientation, false);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [sensorsEnabled]);

  // Compute sensor state based on angle and motion.
  useEffect(() => {
    if (angle === null || lastDeltaMotion === null) {
      setSensorState(null);
      return;
    }
    const isMoving = currentTime - lastDeltaMotion < DEFAULT_MOTION_TIMEOUT;
    let computedState;
    if (!isMoving && angle < 5) {
      computedState = 1;
    } else if (isMoving && angle >= 30 && angle <= 70) {
      computedState = 3;
    } else {
      computedState = 2;
    }
    setSensorState(computedState);
    debugLog('Computed sensor state:', computedState);
  }, [angle, lastDeltaMotion, currentTime]);

  // Play or stop sound effect based on sensor state.
  useEffect(() => {
    if (sensorState === 2 && prevStateRef.current !== 2) {
      if (audioRef.current) {
        audioRef.current.play().catch((error) => console.error('Audio play failed:', error));
        debugLog('Playing sound effect for state 2.');
      }
    } else if (sensorState !== 2) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        debugLog('Stopping sound effect.');
      }
    }
    prevStateRef.current = sensorState;
  }, [sensorState]);

  return { sensorState, angle, lastDeltaMotion, currentTime };
}
