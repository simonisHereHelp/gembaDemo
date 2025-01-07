import React, { useState, useEffect, useRef, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from '@theme/Layout';
import { GlobalPhotoContext } from '../theme/Root';

const WebcamSetup = () => {
  const [devices, setDevices] = useState([]);
  const [cameraMappings, setCameraMappings] = useState({});
  const videoRefs = useRef([]);
  const { setFaceCam, setTopCam } = useContext(GlobalPhotoContext);
  const [faceCam, setLocalFaceCam] = useState(localStorage.getItem('faceCam') || "none");
  const [topCam, setLocalTopCam] = useState(localStorage.getItem('topCam') || "none");
  const [microCam, setLocalMicroCam] = useState(localStorage.getItem('microCam') || "none");

  const getMarkdownContent = () => `
| **Camera**         | **1 - Face Camera**                     | **2 - Benchtop Camera**               | **3 - Microscope Camera**               |
|---------------------|-----------------------------------------|---------------------------------------|-----------------------------------------|
| **Function**        | For login, ensures seamless recognition | Capture practice work photos, top view | Capture detailed microscope images       |
| **LocalStorage**    | ${faceCam.slice(0, 5)}                | ${topCam.slice(0, 5)}                | ${microCam.slice(0,5)}                |
`;

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter((device) => device.kind === 'videoinput');
        setDevices(videoDevices);

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

  const handleMappingChange = (deviceId, mapping) => {
    const updatedMappings = {
      ...cameraMappings,
      [deviceId]: mapping,
    };
    setCameraMappings(updatedMappings);
    localStorage.setItem('cameraMappings', JSON.stringify(updatedMappings));

    if (mapping === '1') {
      setLocalFaceCam(deviceId);
      localStorage.setItem('faceCam', deviceId);
      setFaceCam(deviceId); // Update global state
    } else if (mapping === '2') {
      setLocalTopCam(deviceId);
      localStorage.setItem('topCam', deviceId);
      setTopCam(deviceId); // Update global state
    } else if (mapping === '3') {
      setLocalMicroCam(deviceId);
      localStorage.setItem('microCam', deviceId);
    }
  };

  return (
    <Layout title="Set Up Webcam" description="Assign cameras to specific functions">
      <div style={{ width: '50%', margin: '0 auto' }}>
        <h3>Set Up Webcam</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {devices.map((device, index) => (
            <div
              key={device.deviceId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '20px',
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
              <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 'bold', margin: '5px 0' }}>
                {device.label.length > 50
                  ? `${device.label.slice(0, 50)}...`
                  : device.label}
              </p>
              <p style={{ fontWeight: 'normal' }}>
                {device.deviceId.slice(0, 5)}.
              </p>
                <select
                  onChange={(e) => handleMappingChange(device.deviceId, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '5px',
                    fontSize: '16px',
                  }}
                  value={cameraMappings[device.deviceId] || 'none'}
                >
                  <option value="none">None (do not use)</option>
                  <option value="1">1 - Face Camera</option>
                  <option value="2">2 - Benchtop Camera</option>
                  <option value="3">3 - Microscope Camera</option>
                </select>
                <p style={{ marginTop: '5px', fontSize: '14px', color: '#555' }}>
                  Selected Function: {cameraMappings[device.deviceId] || 'None'}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{getMarkdownContent()}</ReactMarkdown>
        </div>
      </div>
    </Layout>
  );
};

export default WebcamSetup;
