import React, { useState, useEffect, createContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import VideoChapters from '../components/VideoChapters';
import { findChapterId } from '../components/findTimeStamp'; // Import the findChapterId utility

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
  const [LiveDetected, setLiveDetected] = useState(false); // New global state for liveness
  const [buttonClicked, setButtonClicked] = useState(false); // Local state for hiding button after click



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

  return (
    <GlobalPhotoContext.Provider 
    value={{ 
      savedPhotos, setSavedPhotos,
      initialized, setInitialized, 
      isToggled, setIsToggled,
      chapterId, setChapterId,
      LiveDetected, setLiveDetected,
      }}>
      {chapterId !== null && isVideoMode && (
        <VideoChapters/> 
      )}
      {!LiveDetected && !buttonClicked && (
        <button
          className="face-login-button"
          onClick={() => {
            setButtonClicked(true); // Hide the button on click
            history.push('/liveness-detect'); // Navigate to liveness-detect page
          }}
        >
          &#x1F4F7; Face Login
        </button>
      )}
      {children}
    </GlobalPhotoContext.Provider>
  );
};

export default Root;
