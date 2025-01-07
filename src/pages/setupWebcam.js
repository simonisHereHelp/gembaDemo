import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from "@theme/Layout";

const WebcamSetup = () => {
  const [devices, setDevices] = useState([]); // Store the list of video devices
  const [cameraMappings, setCameraMappings] = useState({}); // Store mappings of devices to functions
  const videoRefs = useRef([]); // Refs for multiple video elements
  const markdownContent = `

| **Camera**         | **1 - Face Camera**                     | **2 - Benchtop Camera**               | **3 - Microscope Camera**               |
|---------------------|-----------------------------------------|---------------------------------------|-----------------------------------------|
| **Function**        | For login, ensures seamless recognition | Capture practice work photos, top view | Capture detailed microscope images       |
| **Where is it?**    | Tablet face camera                     | Webcam mounted on the kiosk            | Connected to a microscope adapter        |
`;

  useEffect(() => {
    // Load saved mappings from localStorage
    const savedMappings = localStorage.getItem('cameraMappings');
    if (savedMappings) {
      setCameraMappings(JSON.parse(savedMappings));
    }

    // Fetch all video input devices
    const fetchDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter((device) => device.kind === 'videoinput');
        setDevices(videoDevices);

        // Start streams automatically upon mounting
        videoDevices.forEach((device, index) => startStream(device.deviceId, index));
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  // Start livestream for a given deviceId
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

  // Handle camera mapping selection
  const handleMappingChange = (deviceId, mapping) => {
    const updatedMappings = {
      ...cameraMappings,
      [deviceId]: mapping,
    };

    setCameraMappings(updatedMappings);

    // Save the updated mappings to localStorage
    localStorage.setItem('cameraMappings', JSON.stringify(updatedMappings));
  };

  return (
    <Layout title="Log-In Detection" description="via FaceCam for seamless log-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '50%', margin: '0 auto' }}>
        <h3>Set Up Webcam</h3>
        {devices.map((device, index) => (
          <div key={device.deviceId} style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
            {/* Display trimmed device label */}
            <p style={{ fontWeight: 'bold', margin: '5px 0' }}>
              {device.label.length > 50 ? `${device.label.slice(0, 50)}...` : device.label}
            </p>
            {/* Video livestream */}
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              autoPlay
              playsInline
              style={{
                width: '160px',
                height: '120px',
                border: '1px solid #000',
                borderRadius: '5px',
              }}
            ></video>
            {/* Dropdown for mapping */}
            <select
              onChange={(e) => handleMappingChange(device.deviceId, e.target.value)}
              style={{
                marginTop: '10px',
                padding: '5px',
                fontSize: '16px',
              }}
              value={cameraMappings[device.deviceId] || "none"} // Pre-select saved value
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
        ))}
      </div>
      <div style={{ width: '50%', margin: '0 auto' }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
      </div>
    </Layout>
  );
};

export default WebcamSetup;