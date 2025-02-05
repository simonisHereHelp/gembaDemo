import React, { useState, useEffect, createContext, useRef } from 'react'; 
import { useHistory, useLocation } from 'react-router-dom';
import VideoChapters from '../components/VideoChapters';
import { findChapterId } from '../components/findTimeStamp'; // Import the findChapterId utility
import loginIcon from '@site/static/img/log-in.png';
import logoutIcon from '@site/static/img/log-out.png';

// Create a context for managing the global photos
export const GlobalPhotoContext = createContext();

const Root = ({ children }) => {
  const location = useLocation();
  const history = useHistory();
  const [previousLocation, setPreviousLocation] = useState(null); // Store the last visited path
  const [savedPhotos, setSavedPhotos] = useState(Array(12).fill(null)); // Array to store 12 photos

  // Global states for video
  const [initialized, setInitialized] = useState(false);
  const [isToggled, setIsToggled] = useState(false); // Toggled state for view
  const [chapterId, setChapterId] = useState(null); 
  const [loginName, setLoginName] = useState(null); // Global login state
  const [loginReturnLoc, setLoginReturnLoc] = useState(null); 
  const swishAudio = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false); // State for flip animation
  const isVideoMode = location.pathname.startsWith('/docs/prov'); // Check if in video mode
  const isPreVideoMode = previousLocation?.startsWith('/docs/prov'); // Check if the previous location was in video mode
  const [faceCam, setFaceCam] = useState(null);
  const [topCam, setTopCam] = useState(null);
  const [microCam, setMicroCam] = useState(null);

  const initializeLocalStored = () => {
    // Retrieve mappings from localStorage
    const storedMappings = JSON.parse(localStorage.getItem('cameraMappings')) || {};
  
    // Extract individual camera mappings
    const storedFaceCam = storedMappings[1] || 'none';
    const storedTopCam = storedMappings[2] || 'none';
    const storedMicroCam = storedMappings[3] || 'none';
  
    // Update global states
    setFaceCam(storedFaceCam);
    setTopCam(storedTopCam);
    setMicroCam(storedMicroCam);
  
    console.log('Initialized from localStorage:', {
      faceCam: storedFaceCam,
      topCam: storedTopCam,
      microCam: storedMicroCam,
    });
  };

  useEffect(() => {
    initializeLocalStored();
  }, []);

  // Lazy initialization of audio object to avoid SSR issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@site/static/img/swoosh.mp3').then(({ default: audioSrc }) => {
        swishAudio.current = new Audio(audioSrc);
      });
    }
  }, []);

  // Effect to manage chapterId and navigation to the correct chapter when returning to the video section
  useEffect(() => {
    if (isVideoMode && initialized && !isPreVideoMode) {
      // If initialized and the user is returning to Videos from a different section
      // Apply history.push to restore the last visited chapter
      if (chapterId !== null) {
        history.push(`/docs/prov${chapterId + 1}`); // Adjust according to your URL structure
      }
    }
  }, [isVideoMode, initialized, chapterId, previousLocation]);
  useEffect(() => {
    if (isVideoMode && loginReturnLoc) {
      // If initialized and the user is returning to Videos from a different section
      // Apply history.push to restore the last visited chapter
      if (chapterId !== null) {
        history.push(`/docs/prov${chapterId + 1}`); // Adjust according to your URL structure
      }
    }
  }, [loginReturnLoc]);

  useEffect(() => {
    if (isVideoMode) {
      const newChapterId = findChapterId(location); // Find the chapterId using location
      setChapterId(newChapterId);
    }
    setPreviousLocation(location.pathname);
  }, [location.pathname, isVideoMode]);
  
  useEffect(() => {
    initializeLocalStored(); // Initialize global state from localStorage
  }, [initializeLocalStored]);

  const handleIconClick = () => {
    if (swishAudio.current) {
      swishAudio.current.currentTime = 0; // Reset sound
      swishAudio.current.play(); // Play sound
    } else {
      console.warn('Audio not initialized');
    }
    setIsFlipped((prev) => !prev);
    setLoginReturnLoc(location.pathname);
    if (!loginName) {
      history.push('/face');
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
      faceCam, setFaceCam,  // Add faceCam
      topCam, setTopCam,
      microCam,setMicroCam,
      }}>
      {chapterId !== null && isVideoMode && (
        <VideoChapters/> 
      )}
      {children}
      <section>
      <div className={`bottom-nav-menu${isFlipped ? ' flip' : ''}`}>
             <p>{loginName ? `User: ${loginName}` : 'No User Logged In'}</p>
           <div
             className="primaryButton center-align "
             onClick={handleIconClick}>
            <img
               src={loginName ? logoutIcon : loginIcon}
               alt={loginName ? 'Log Out' : 'Log In'}
               className="nav-icon"
             />
             {loginName ? 'Log Out' : 'Log In'}
           </div>
         </div>
        </section>
    </GlobalPhotoContext.Provider>
  );
};

export default Root;
