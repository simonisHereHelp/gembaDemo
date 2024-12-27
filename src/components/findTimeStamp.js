const endTimeTable = [
  133,    // prov1
  151,    // prov2
  187,    // prov3
  318,    // prov4
  404,    // prov5
  459,    // prov6
  539,    // prov7
  587,    // prov8
  648,    // prov9
  698,    // prov10
  739,    // prov11
  808,    // prov12
  821     // prov13
];

const tutorialDocs = [
  'prov1', 'prov2', 'prov3', 'prov4', 'prov5', 'prov6', 
  'prov7', 'prov8', 'prov9', 'prov10', 'prov11', 'prov12', 'prov13'
];

const chapterTitles = [
  "Step A", "Step B", "Step C", "Step D", "Step E", 
  "Step F", "Step G", "Step H", "Step I", "Step J", 
  "Step K", "Step L", "Step M"
];

// Extract the document ID from the path, whether it's /docs/next/provX or /docs/provX
export const extractDocId = (pathname) => {
  const parts = pathname.split('/');
  return parts[parts.length - 1]; // Return the last part (e.g., 'prov1')
};

// Find the chapter ID based on the current location
export const findChapterId = (location) => { 
  const docId = extractDocId(location.pathname); // Extract the document ID from the path
  const docIndex = tutorialDocs.indexOf(docId);

  if (docIndex === -1) return null; // Return null if docId is not found

  return docIndex; // Return the chapter index
};

// Find the start time based on the chapter ID
export const findStartTime = (chapterId) => { 
  if (chapterId === null) return null; // Return null if chapterId is not found

  // For the first document (prov1), start time is always 0
  if (chapterId === 0) return 0;

  // For other documents, start time is the previous document's endTime + 1
  return endTimeTable[chapterId - 1] + 1;
};

// Find the end time based on the chapter ID
export const findEndTime = (chapterId) => {
  if (chapterId === null) return null; // Return null if chapterId is not found

  // Return the corresponding end time from the endTimeTable
  return endTimeTable[chapterId];
};

// Find the chapter title based on the chapter ID
export const findChapterTitle = (chapterId) => {
  if (chapterId === null) return null; // Return null if chapterId is not found

  // Return the corresponding chapter title from the chapterTitles array
  return chapterTitles[chapterId];
};
