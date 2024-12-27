import React, { useContext } from 'react';
import { GlobalPhotoContext } from '@site/src/theme/Root'; // Import global photos context
import { findChapterTitle } from './findTimeStamp'; // Import findChapterTitle utility

// Component for photos 1-12
const ListSavedPhotos = () => {
  const { savedPhotos } = useContext(GlobalPhotoContext); // Access global photos context

  return (
    <>
      {savedPhotos.slice(0, 12).map((photo, index) => {
        const chapterTitle = findChapterTitle(index); // Get chapter title for the index
        return (
          <React.Fragment key={index}>
            {/* Markdown heading syntax */}
            <br />
            <h3># {index + 1}: {chapterTitle}</h3> {/* Display index and chapter title */}
            <p>{photo ? '' : '(blank)'}</p>
            {photo && photo.image ? (
              <img src={photo.image} alt={`Photo ${index + 1}`} width="720" height="480" />
            ) : (
              <p>--</p>
            )}
            <hr />
          </React.Fragment>
        );
      })}
    </>
  );
};

export { ListSavedPhotos };
