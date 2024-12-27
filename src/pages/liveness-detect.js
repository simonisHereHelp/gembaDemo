import React, { useEffect, useRef, useContext } from 'react';
import { GlobalPhotoContext } from '../theme/Root';

const LivenessDetect = () => {
  const { setLiveDetected } = useContext(GlobalPhotoContext);
  const videoRef = useRef(null);

  useEffect(() => {
    // Access the webcam
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    getCameraStream();

    return () => {
      // Clean up webcam access
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const performLivenessDetection = async () => {
  const fileInput = 'test.jpg'; // Local test file

  // Create a FormData object
  const formData = new FormData();
  formData.append('selfie', fileInput);
  formData.append('threshold', '0.6');

  try {
    // Perform Kairos Liveness Detection
    const response = await fetch('https://idv-eu.kairos.com/v0.1/liveness-verification', {
      method: 'POST',
      headers: {
        'app_id': process.env.REACT_APP_KAIROS_APP_ID,
        'app_key': process.env.REACT_APP_KAIROS_APP_KEY,
      },
      body: formData,
    });

    const result = await response.json();
    if (result.response_data && result.response_data.faces_liveness > 0.5) {
      setLiveDetected(true);
    } else {
      alert('Liveness detection failed. Please try again.');
    }
  } catch (error) {
    console.error('Error performing liveness detection:', error);
  }
};

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '30%', border: '2px solid #ccc', borderRadius: '8px' }}
      />
      <button onClick={performLivenessDetection} className="face-login-button">
        Verify Liveness
      </button>
    </div>
  );
};

export default LivenessDetect;
