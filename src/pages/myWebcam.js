import React, { useEffect, useRef } from 'react';
import Layout from '@theme/Layout';

function MyWebcam() {
  const videoRef = useRef(null);

  useEffect(() => {
    // Request access to the webcam (video only)
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('Error accessing webcam:', err);
      });
  }, []);

  return (
    <Layout title="Set Up Webcam" description="Assign cameras to specific functions">
      <div
        style={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </Layout>
  );
}

export default MyWebcam;
