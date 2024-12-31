import React, { useState, useEffect, createContext, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import VideoChapters from '../components/VideoChapters';
import { findChapterId } from '../components/findTimeStamp'; // Import the findChapterId utility
//import BottomNav from '../components/BottomNav';
import loginIcon from '@site/static/img/log-in.png';
import logoutIcon from '@site/static/img/log-out.png';
import swishSound from '@site/static/img/swoosh.mp3'
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
  const swishAudio = useRef(new Audio(swishSound));
  const isVideoMode = location.pathname.startsWith('/docs/prov'); // Check if in video mode
  const isPreVideoMode = previousLocation?.startsWith('/docs/prov'); // Check if the previous location was in video mode
  const isNewDoc = previousLocation !== location.pathname;

  // Effect to manage chapterId and navigation to the correct chapter when returning to the video section
  useEffect(() => {
    if (isVideoMode && initialized && !isPreVideoMode) {
      // If initialized and the user is returning to Videos from a different section
      // Apply history.push to restore the last visited chapter
      if (chapterId !== null) {
        history.push(`/docs/prov${chapterId + 1}`); // Adjust according to your URL structure
        console.log(`Returning to prov${chapterId + 1}`);
      }
    }
  }, [isVideoMode, initialized, chapterId, previousLocation]);

  // Effect to update chapterId and previousLocation when switching between docs
  useEffect(() => {
    if (isVideoMode) {
      const newChapterId = findChapterId(location); // Find the chapterId using location
      setChapterId(newChapterId);
      console.log("root new ChapterId ", newChapterId);
    }

    // Update previousLocation to the current pathname
    setPreviousLocation(location.pathname);
  }, [location.pathname, isVideoMode]);

  const faceLoginClick = () => {
    swishAudio.current.currentTime = 0;
    swishAudio.current.play();
    setLoginReturnLoc(location.pathname);
    if (loginName) {
      history.push('/log-out-user');
      setLoginName(null);
    } else {
      // Navigate to FaceDetection for login
      history.push('/face');
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
      }}>
      {chapterId !== null && isVideoMode && (
        <VideoChapters/> 
      )}
      {(<div className={`bottom-nav-menu`}>
           <div style={{ textAlign: 'center', marginBottom: '10px' }}>
             <strong>{loginName ? `User: ${loginName}` : 'No User Logged In'}</strong>
           </div>
           <div
             className="bottom-nav-item"
             onClick={faceLoginClick}
             style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
           >
             <img
               src={loginName ? logoutIcon : loginIcon}
               alt={loginName ? 'Log Out' : 'Log In'}
               className="nav-icon"
             />
             <strong style={{ marginLeft: '10px' }}>{loginName ? 'Log Out User' : 'Log In User'}</strong>
           </div>
         </div>
      )}
      {children}
    </GlobalPhotoContext.Provider>
  );
};

export default Root;
