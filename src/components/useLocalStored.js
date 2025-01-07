// src/components/useLocalStored.js
import { useContext, useCallback } from 'react';
import { GlobalPhotoContext } from '../theme/Root';

const useLocalStored = () => {
  const { setFaceCam, setTopCam, setMicroCam } = useContext(GlobalPhotoContext);

  const initializeLocalStorage = useCallback(() => {
    // Retrieve values from localStorage
    const faceCam = localStorage.getItem('faceCam') || 'none';
    const topCam = localStorage.getItem('topCam') || 'none';
    const microCam = localStorage.getItem('microCam') || 'none';

    // Update the global state with retrieved values
    setFaceCam(faceCam);
    setTopCam(topCam);
    setMicroCam(microCam);

    console.log('Global states updated from localStorage:', { faceCam, topCam, microCam });
  }, [setFaceCam, setTopCam, setMicroCam]);

  return initializeLocalStorage;
};

export default useLocalStored;
