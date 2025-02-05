import React, { useState, useEffect, useRef, useContext } from 'react';
import Layout from '@theme/Layout';
import { GlobalPhotoContext } from '../theme/Root';

const WebcamSetup = () => {
  const [devices, setDevices] = useState([]);
  const [cameraMappings, setCameraMappings] = useState({ 1: null, 2: null, 3: null });
  const videoRefs = useRef([]);
  const { setFaceCam, setTopCam, setMicroCam } = useContext(GlobalPhotoContext);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter((device) => device.kind === 'videoinput');
        setDevices(videoDevices);

        // Start video streams
        videoDevices.forEach((device, index) => startStream(device.deviceId, index));
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    const savedMappings = localStorage.getItem('cameraMappings');
    if (savedMappings) {
      setCameraMappings(JSON.parse(savedMappings));
    }

    fetchDevices();
  }, []);

  const startStream = async (deviceId, index) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
      });
      if (videoRefs.current[index]) {
        videoRefs.current[index].srcObject = stream;
      }
    } catch (error) {
      console.error(`Error starting stream for device ${deviceId}:`, error);
    }
  };

  const handleMappingChange = (functionKey, deviceId) => {
    const updatedMappings = { ...cameraMappings, [functionKey]: deviceId };
    setCameraMappings(updatedMappings);

    if (functionKey === 1) setFaceCam(deviceId);
    if (functionKey === 2) setTopCam(deviceId);
    if (functionKey === 3) setMicroCam(deviceId);

    localStorage.setItem('cameraMappings', JSON.stringify(updatedMappings));
  };

  return (
    <Layout title="Set Up Webcam" description="Assign cameras to specific functions">
      <div style={{ width: '60%', margin: '0 auto' }}>
        <h3>Available Devices</h3>
        {devices.map((device, index) => (
          <div
            key={device.deviceId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '20px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
            }}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              autoPlay
              playsInline
              style={{
                width: '200px',
                height: '150px',
                border: '1px solid #000',
                borderRadius: '5px',
              }}
            ></video>
            <div>
              <p style={{ fontWeight: 'bold', margin: '5px 0' }}>
                {device.label.length > 50 ? `${device.label.slice(0, 50)}...` : device.label}
              </p>
              <p style={{ fontWeight: 'normal' }}>Device ID: {device.deviceId.slice(0, 5)}</p>
            </div>
          </div>
        ))}

        <h3>Set Up Webcam</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {[1, 2, 3].map((functionKey) => (
            <div key={functionKey} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <h4>
                {functionKey === 1
                  ? '1 - Face Camera'
                  : functionKey === 2
                  ? '2 - Benchtop Camera'
                  : '3 - Microscope Camera'}
              </h4>
              <p>
                {functionKey === 1
                  ? 'For login, ensures seamless recognition.'
                  : functionKey === 2
                  ? 'Capture practice work photos, top view.'
                  : 'Capture detailed microscope images.'}
              </p>
              <select
                onChange={(e) => handleMappingChange(functionKey, e.target.value)}
                style={{ width: '100%', padding: '5px', fontSize: '16px' }}
                value={cameraMappings[functionKey] || 'none'}
              >
                <option value="none">None (do not use)</option>
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
              <p style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
                Mapped Device: {cameraMappings[functionKey] ? devices.find((d) => d.deviceId === cameraMappings[functionKey])?.label || 'None' : 'None'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default WebcamSetup;
