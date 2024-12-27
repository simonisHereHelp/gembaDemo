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
    const selfieCanvas = document.createElement('canvas');
    const context = selfieCanvas.getContext('2d');
    selfieCanvas.width = videoRef.current.videoWidth *0.5;
    selfieCanvas.height = videoRef.current.videoHeight *0.5;
    context.drawImage(videoRef.current, 0, 0);

    const selfieData = selfieCanvas.toDataURL('image/jpeg');

    // Perform Kairos Liveness Detection
    const response = await fetch('https://idv-eu.kairos.com/v0.1/liveness-verification', {
      method: 'POST',
      headers: {
        'app_id': '62748859',
        'app_key': '79061d113966b6d5a2a2f4b6b546df7a',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selfie: selfieData,
        threshold: '0.6',
      }),
    });

    const result = await response.json();
    if (result.response_data && result.response_data.faces_liveness > 0.5) {
      setLiveDetected(true);
    } else {
      alert('Liveness detection failed. Please try again.');
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
       Submit
      </button>
    </div>
  );
};

export default LivenessDetect;
