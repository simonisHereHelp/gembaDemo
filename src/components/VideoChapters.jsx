import React, { useEffect, useContext, useState } from 'react';
import { GlobalPhotoContext } from '@site/src/theme/Root'; // Global context
import { findStartTime, findEndTime, findChapterTitle } from './findTimeStamp'; // Updated utilities
import VideoCameraControl from './VideoCameraControl'; // Video component
import { refreshBar } from './refreshBar';

const VideoChapters = ({ }) => {
  const { 
    savedPhotos, setSavedPhotos, 
    initialized, setInitialized, 
    isToggled, setIsToggled, 
    chapterId, setChapterId,
    topCam
  } = useContext(GlobalPhotoContext);
  
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);

  // Task 1: Sync savedPhotos with the Docusaurus sidebar when chapterId is valid
  useEffect(() => {

    if (chapterId !== null && savedPhotos) {
      refreshBar(chapterId, savedPhotos, findChapterTitle);
    } else {
      console.warn("Either chapterId is null or savedPhotos is undefined.");
    }
  }, [chapterId, savedPhotos]);

  // Task 2: Find start and end time based on chapterId and pass to VideoCameraControl
  useEffect(() => {
    if (chapterId === null) {
      // Case 1: chapterId is null
      if (previousLocation?.startsWith('docs/prov')) {

      }
    } else {
      // Case 2: chapterId is not null
      const start = findStartTime(chapterId); 
      const end = findEndTime(chapterId); // Get the end time for the chapter
      setStartTime(start);
      setEndTime(end);
    }
  }, [chapterId]);

  return (
    <>
      {/* Render VideoCameraControl when startTime and endTime are available */}
      {startTime !== null && endTime !== null ? (
        <VideoCameraControl
          chapterId={chapterId} 
          setChapterId={setChapterId} // Pass setChapterId to VideoCameraControl
          startTime={startTime} 
          endTime={endTime}
          savedPhotos={savedPhotos} 
          setSavedPhotos={setSavedPhotos} 
          initialized={initialized}  // Pass global initialized state
          setInitialized={setInitialized}  // Pass setter for initialized
          isToggled={isToggled}  // Pass global isToggled state
          setIsToggled={setIsToggled}
          topCam={topCam}     // Add topCam
        />
      ) : null}
    </>
  );
};

export default VideoChapters;
