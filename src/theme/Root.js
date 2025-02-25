import React, { useState, useEffect, createContext, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import VideoChapters from '../components/VideoChapters';
import { findChapterId } from '../components/findTimeStamp'; // Import the findChapterId utility
import loginIcon from '@site/static/img/log-in.png';
import logoutIcon from '@site/static/img/log-out.png';
import { requestMotionPermission, useMotionState } from '@site/src/components/useMotionTracker';

// Create a context for managing the global photos
export const GlobalPhotoContext = createContext();

const Root = ({ children }) => {
  const location = useLocation();
  const history = useHistory();
  const [previousLocation, setPreviousLocation] = useState(null); // Store last visited path
  const [savedPhotos, setSavedPhotos] = useState(Array(12).fill(null)); // Array to store 12 photos

  // Global states for video and user
  const [initialized, setInitialized] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [chapterId, setChapterId] = useState(null);
  const [loginName, setLoginName] = useState(null);
  const [loginReturnLoc, setLoginReturnLoc] = useState(null);
  const swishAudio = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const isVideoMode = location.pathname.startsWith('/docs/prov');
  const isPreVideoMode = previousLocation?.startsWith('/docs/prov');
  const [faceCam, setFaceCam] = useState(null);
  const [topCam, setTopCam] = useState(null);
  const [microCam, setMicroCam] = useState(null);

  // Initialize localStorage camera mappings.
  const initializeLocalStored = () => {
    const storedMappings = JSON.parse(localStorage.getItem('cameraMappings')) || {};
    setFaceCam(storedMappings[1] || 'none');
    setTopCam(storedMappings[2] || 'none');
    setMicroCam(storedMappings[3] || 'none');
    console.log('Initialized from localStorage:', {
      faceCam: storedMappings[1] || 'none',
      topCam: storedMappings[2] || 'none',
      microCam: storedMappings[3] || 'none',
    });
  };

  useEffect(() => {
    initializeLocalStored();
  }, []);

  // Lazy initialization of audio to avoid SSR issues.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@site/static/img/swoosh.mp3').then(({ default: audioSrc }) => {
        swishAudio.current = new Audio(audioSrc);
      });
    }
  }, []);

  useEffect(() => {
    if (isVideoMode && initialized && !isPreVideoMode && chapterId !== null) {
      history.push(`/docs/prov${chapterId + 1}`);
    }
  }, [isVideoMode, initialized, chapterId, previousLocation]);

  useEffect(() => {
    if (isVideoMode && loginReturnLoc && chapterId !== null) {
      history.push(`/docs/prov${chapterId + 1}`);
    }
  }, [loginReturnLoc]);

  useEffect(() => {
    if (isVideoMode) {
      const newChapterId = findChapterId(location);
      setChapterId(newChapterId);
    }
    setPreviousLocation(location.pathname);
  }, [location.pathname, isVideoMode]);

  // --- Motion sensor integration ---
  // We'll use a local state for motion permission.
  const [motionPermission, setMotionPermission] = useState(false);

  // Request motion sensor permission only when user clicks.
  useEffect(() => {
    // Do not auto-request on mount; let the user trigger it.
  }, []);

  // Get motion sensor state from our custom hook.
  // We pass motionPermission as the "enabled" flag.
  const { sensorState, angle, lastDeltaMotion, currentTime: motionTime } = useMotionState(motionPermission);

  // Navigation based on motion sensor state.
  useEffect(() => {
    if (!motionPermission) return; // only act if motion sensors are enabled
    if (sensorState === 2) {
      // If state equals 2, navigate to the webcam page.
      if (location.pathname !== '/pages/myWebcam') {
        history.push('/pages/myWebcam');
      }
    } else {
      // If sensor state is not 2 and current location is myWebcam, return to previous location.
      if (location.pathname === '/pages/myWebcam' && previousLocation) {
        history.push(previousLocation);
      }
    }
  }, [sensorState, motionPermission, history, location, previousLocation]);

  const handleMotionPermission = () => {
    requestMotionPermission().then((granted) => {
      setMotionPermission(granted);
    });
  };

  const handleIconClick = () => {
    if (swishAudio.current) {
      swishAudio.current.currentTime = 0;
      swishAudio.current.play();
    } else {
      console.warn('Audio not initialized');
    }
    setIsFlipped((prev) => !prev);
    setLoginReturnLoc(location.pathname);
    if (!loginName) {
      history.push('/golive_room2');
    } else {
      history.push('/log-out-user');
    }
  };

  return (
    <GlobalPhotoContext.Provider 
      value={{ 
        savedPhotos, setSavedPhotos,
        initialized, setInitialized, 
        isToggled, setIsToggled,
        chapterId, setChapterId,
        loginName, setLoginName,
        loginReturnLoc, setLoginReturnLoc,
        faceCam, setFaceCam,
        topCam, setTopCam,
        microCam, setMicroCam,
      }}>
      {chapterId !== null && isVideoMode && (
        <VideoChapters/> 
      )}
      {children}
      <section>
        <div className={`bottom-nav-menu${isFlipped ? ' flip' : ''}`}>
          <p>{loginName ? `User: ${loginName}` : 'My Webcam'}</p>
          {!loginName && (
            <div className="primaryButton center-align" onClick={handleIconClick}>
              <img
                src={loginName ? logoutIcon : loginIcon}
                alt={loginName ? 'Sign On' : 'Sign Off'}
                className="nav-icon"
              />
              {loginName ? 'Log Out' : 'Go Live!'}
            </div>
          )}
          {/* Motion sensor permission prompt */}
          {!motionPermission && (
            <div style={{ marginTop: '1rem' }}>
              <button onClick={handleMotionPermission}>
                Enable Motion Sensors
              </button>
              <span style={{ marginLeft: '1rem' }}>Motion sensor permission required</span>
            </div>
          )}
        </div>
      </section>
    </GlobalPhotoContext.Provider>
  );
};

export default Root;
