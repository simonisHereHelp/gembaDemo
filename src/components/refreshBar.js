// refreshBar.js
export const refreshBar = (chapterId, savedPhotos, findChapterTitle) => {
    if (!savedPhotos || !Array.isArray(savedPhotos)) {
        console.error("savedPhotos is not a valid array:", savedPhotos);
      } else {
        console.log("savedPhotos in refreshBar:", savedPhotos);
      }

    if (chapterId !== null) {
      const sidebarItems = document.querySelectorAll('.menu__link'); // Select sidebar items
      // Update sidebar items with saved state
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
  
      // Highlight the active sidebar item
      const currentChapterTitle = findChapterTitle(chapterId);
      sidebarItems.forEach((item) => {
        if (item.textContent.trim() === currentChapterTitle) {
          item.classList.add('menu__link--active'); // Add active class
        } else {
          item.classList.remove('menu__link--active'); // Remove active class from others
        }
      });
    }
  };
  