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
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const performLivenessDetection = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
      const formData = new FormData();
      formData.append('selfie', blob, 'selfie.jpg');
      formData.append('threshold', '0.6');

      const response = await fetch('https://idv-eu.kairos.com/v0.1/liveness-verification', {
        method: 'POST',
        headers: {
          'app_id': process.env.REACT_APP_KAIROS_APP_ID,
          'app_key': process.env.REACT_APP_KAIROS_APP_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.response_data && data.response_data.faces_liveness > 0.5) {
        setLiveDetected(true);
      } else {
        alert('Liveness detection failed. Please try again.');
      }
    } catch (error) {
      console.error('Error performing liveness detection:', error);
      alert('An error occurred while verifying liveness.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '80%', border: '2px solid #ccc', borderRadius: '8px' }}
      />
      <button onClick={performLivenessDetection} className="face-login-button">
        Verify Liveness
      </button>
    </div>
  );
};

export default LivenessDetect;
