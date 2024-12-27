import React, { useEffect, useState } from 'react';

function Goodbye() {
  const [baseUrl, setBaseUrl] = useState('./');  // Default base URL

  useEffect(() => {
    // Close WebSocket or other connections
    if (typeof websocket !== 'undefined') {
      websocket.close();
      console.log("WebSocket closed.");
    }

    // Clear session and local storage
    sessionStorage.clear();
    localStorage.clear();
    console.log("Session and local storage cleared.");

    // Stop any active media streams (like webcam/mic)
    if (typeof mediaStream !== 'undefined') {
      mediaStream.getTracks().forEach(track => track.stop());
      console.log("Media stream stopped.");
    }

    // Get the current base URL
    setBaseUrl(window.location.origin + '/');

  }, []);  // This effect runs once when the component mounts

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
        Click below to start again:
      </p>
      {/* Display the base URL as a clickable link */}
      <a href={baseUrl} style={{ fontSize: '18px', color: 'blue', textDecoration: 'underline' }}>
        Coaching Video Program [SOP #XXX]
      </a>
    </div>
  );
}

export default Goodbye;
