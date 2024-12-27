import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import './golive.css';

import { initializeCallInstance, cleanupCallInstance } from "../components/golive-callInstance";
import { setupCompositeCameraView } from "../components/golive-cameraSetup";
import { toggleVideoStream } from "../components/golive-toggleFunctions";

import videoOnIcon from "@site/static/img/video-on.png";
import videoOffIcon from "@site/static/img/video-off.png";
import homeIcon from "@site/static/img/home.png";
import { SendInviteEmail } from "../components/SendInviteEmail";

const GoLive = () => {
  const videoContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const history = useHistory();

  const [stream1, setStream1] = useState(null);
  const [stream2, setStream2] = useState(null);
  const [combinedStream, setCombinedStream] = useState(null);
  const [isVideoOnStream1, setIsVideoOnStream1] = useState(true);
  const [isVideoOnStream2, setIsVideoOnStream2] = useState(true);
  const [deviceName1, setDeviceName1] = useState("Unknown Device 1");
  const [deviceName2, setDeviceName2] = useState("Unknown Device 2");
  const [participants, setParticipants] = useState({});

  useEffect(() => {
    const setupStreams = async () => {
      // Get device names and combined stream from setupCompositeCameraView
      const { deviceName1, deviceName2, combinedStream } = await setupCompositeCameraView(
        setStream1,
        setStream2,
        canvasRef,
        videoContainerRef
      );

      // Set device names and combined stream state
      setDeviceName1(deviceName1);
      setDeviceName2(deviceName2);
      setCombinedStream(combinedStream);

      // Update local video track if combinedStream is available
      if (combinedStream && combinedStream.getVideoTracks().length > 0) {
        try {
          const videoTrack = combinedStream.getVideoTracks()[0];
          console.log("Setting input devices with combinedStream.");
          const callInstance = initializeCallInstance(setParticipants);
      
          // Use setInputDevicesAsync to explicitly set the video input
          await callInstance.setInputDevicesAsync({ videoSource: videoTrack });
      
          // Update the local video container
          if (videoContainerRef.current) {
            videoContainerRef.current.srcObject = combinedStream;
          }
        } catch (error) {
          console.error("Error setting input devices:", error);
        }
      }
      
    };

    // Initialize streams and call instance
    setupStreams();
    initializeCallInstance(setParticipants, "https://ishere.daily.co/P_20241029_0719");

    // Cleanup on unmount
    return () => {
      cleanupCallInstance();
    };
  }, []);

  const handleHomeClick = () => {
    cleanupCallInstance();
    history.push("/");
  };

  return (
    <div id="goLiveContainer">
      <div id="compositeExit">
        <img src={homeIcon} alt="Go Home" className="homeIcon" onClick={handleHomeClick} />
        <SendInviteEmail deviceName1={deviceName1} deviceName2={deviceName2} />
      </div>

      <div id="participantsContainer">
        {Object.values(participants).map((participant, index) => (
          <div key={index} className="participantContainer">
            <div
              ref={(el) => {
                if (el && !el.contains(participant.videoElement)) {
                  el.innerHTML = "";
                  el.appendChild(participant.videoElement);
                }
              }}
            />
            <div className="participantName">{participant.name}</div>
          </div>
        ))}
      </div>

      <div id="compositeStreamContainer">
        <video ref={videoContainerRef} autoPlay playsInline></video>
        <div className="video-toggle-icons">
          <img
            src={isVideoOnStream1 ? videoOnIcon : videoOffIcon}
            alt="Toggle Video Stream 1"
            className="videoIcon"
            onClick={() => toggleVideoStream(stream1, setIsVideoOnStream1)}
            style={{ left: '3%', bottom: '5px', position: 'absolute' }}
          />
          <img
            src={isVideoOnStream2 ? videoOnIcon : videoOffIcon}
            alt="Toggle Video Stream 2"
            className="videoIcon"
            onClick={() => toggleVideoStream(stream2, setIsVideoOnStream2)}
            style={{ left: '55%', bottom: '5px', transform: 'translateX(-55%)', position: 'absolute' }}
          />
        </div>
      </div>
    </div>
  );
};

export default GoLive;
