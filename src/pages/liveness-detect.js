import React, { useEffect, useRef, useContext } from 'react';
import { GlobalPhotoContext } from '../theme/Root';

const LivenessDetect = () => {
  const { setLiveDetected } = useContext(GlobalPhotoContext);

  const performLivenessDetection = async () => {
    try {
      const formData = new FormData();
      formData.append('selfie', new File([await (await fetch('./img/test.jpg')).blob()], 'test.jpg'));
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
      <button onClick={performLivenessDetection} className="face-login-button">
        Verify Liveness
      </button>
    </div>
  );
};

export default LivenessDetect;
