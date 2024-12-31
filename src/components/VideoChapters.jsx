import React, { useEffect, useContext, useState } from 'react';
import { GlobalPhotoContext } from '@site/src/theme/Root'; // Global context
import { findStartTime, findEndTime, findChapterTitle } from './findTimeStamp'; // Updated utilities
import VideoCameraControl from './VideoCameraControl'; // Video component

const VideoChapters = ({ }) => {
  const { 
    savedPhotos, setSavedPhotos, 
    initialized, setInitialized, 
    isToggled, setIsToggled, 
    chapterId, setChapterId,
    currentTime, setCurrentTime,
    recallTime
  } = useContext(GlobalPhotoContext);
  
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // Debugging chapterId

  // Task 1: Sync savedPhotos with the Docusaurus sidebar when chapterId is valid
  useEffect(() => {
    if (chapterId !== null) {
      const sidebarItems = document.querySelectorAll('.menu__link'); // Select sidebar items

      savedPhotos.forEach((photo, index) => {
        if (photo) {
          const chapterTitle = findChapterTitle(index); // Dynamically get chapter title
          sidebarItems.forEach((item) => {
            if (item.textContent.trim() === chapterTitle) {
              item.textContent = `${chapterTitle} [saved]`; // Update sidebar item with [saved]
            }
          });
        }
      });

      // Highlight the active sidebar item using Docusaurus' current route
      const currentChapterTitle = findChapterTitle(chapterId);
      sidebarItems.forEach((item) => {
        if (item.textContent.trim() === currentChapterTitle) {
          item.classList.add('menu__link--active'); // Use Docusaurus' active class
        } else {
          item.classList.remove('menu__link--active');
        }
      });
    }
  }, [chapterId, savedPhotos]);
  // Task 2: Find start and end time based on chapterId and pass to VideoCameraControl
  useEffect(() => {
    if (chapterId !== null) {
      const start = findStartTime(chapterId); // Get start time for the chapter
      const end = findEndTime(chapterId);   // Get end time for the chapter
      setStartTime(start);
      setEndTime(end);
    }
  }, [chapterId]); // Only trigger when chapterId is valid (not null)

  return (
    <>
      {/* Render VideoCameraControl when startTime and endTime are available */}
      {startTime !== null && endTime !== null ? (
        <VideoCameraControl
          chapterId={chapterId} 
          setChapterId={setChapterId} // Pass setChapterId to VideoCameraControl
          startTime={startTime} 
          endTime={endTime}
          setCurrentTime={setCurrentTime} 
          recallTime = {recallTime}
          savedPhotos={savedPhotos} 
          setSavedPhotos={setSavedPhotos} 
          initialized={initialized}  // Pass global initialized state
          setInitialized={setInitialized}  // Pass setter for initialized
          isToggled={isToggled}  // Pass global isToggled state
          setIsToggled={setIsToggled}  // Pass setter for isToggled
        />
      ) : null}
    </>
  );
};

export default VideoChapters;
