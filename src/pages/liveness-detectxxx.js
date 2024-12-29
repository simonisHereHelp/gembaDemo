import React, { useEffect, useRef, useContext, useState } from 'react';
import { GlobalPhotoContext } from '../theme/Root';
import Layout from '@theme/Layout'; // Import Docusaurus Layout component
import { useHistory, useLocation } from 'react-router-dom';

const LivenessDetect = () => {
  const { setLiveDetected } = useContext(GlobalPhotoContext);
  const videoRef = useRef(null);
  const [ovalDimensions, setOvalDimensions] = useState({ cx: 0, cy: 0, rx: 0, ry: 0 });
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Update oval dimensions when the video loads
          videoRef.current.onloadedmetadata = () => {
            updateOvalDimensions();
          };
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    const updateOvalDimensions = () => {
      if (videoRef.current) {
        const video = videoRef.current;
        const rect = video.getBoundingClientRect();
        const ovalHeight = rect.height / 2.5; // Oval height
        const ovalWidth = ovalHeight / 1.5; // Oval width (half of the height)
    
        setOvalDimensions({
          cx: rect.width / 2, // Center X (middle of video width)
          cy: rect.height / 2, // Center Y (middle of video height)
          rx: ovalWidth, // Width of the oval
          ry: ovalHeight, // Height of the oval
        });
      }
    };
    

    getCameraStream();

    // Update oval dimensions on window resize
    window.addEventListener('resize', updateOvalDimensions);

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      window.removeEventListener('resize', updateOvalDimensions);
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
        setLiveDetected(true);
        console.log('yet to update')
      }
    } catch (error) {
      setLiveDetected(true);
      console.log('yet to update')
    }
    history.go(-1);

  };

  return (
    <Layout title="Liveness Detection"> 
    <div style={{ position: 'relative', textAlign: 'center', marginTop: '20px' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '30%', border: '2px solid #ccc', borderRadius: '8px' }}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none', // Prevent interaction with the SVG
        }}
        width="100%"
        height="100%"
        viewBox={`0 0 ${ovalDimensions.cx * 2} ${ovalDimensions.cy * 2}`}
      >
        <ellipse
          cx={ovalDimensions.cx}
          cy={ovalDimensions.cy}
          rx={ovalDimensions.rx}
          ry={ovalDimensions.ry}
          fill="none"
          stroke="orange"
          strokeWidth="8"
          strokeDasharray="15,20" 
        />
      </svg>
      <button onClick={performLivenessDetection} className="face-login-button">
        Verify
      </button>
    </div>
    </Layout>
  );
};

export default LivenessDetect;
