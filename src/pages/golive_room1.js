import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import "./golive.css";
import Layout from "@theme/Layout";
import { GoliveMeetingStatus } from "../components/golive-meetingStatus";
import Daily from "@daily-co/daily-js";
import { GlobalPhotoContext } from "../theme/Root";

const DAILY_API_KEY = "373a39750ce5b3f4d805c5b7dcfd84a661137ea513f3e748497805a7a0f8225b";

const GoLive = () => {
  const trainerName = "Trainer";

  const sessionUrl = "https://gembaly.daily.co/room_01";
  const [meetingState, setMeetingState] = useState({ roomCreated: false, activeTime: "--", duration: "--" });
  const [isLive, setIsLive] = useState(false);
  const [interval, setInterval] = useState("");
  const { loginReturnLoc, loginName, setLoginName } = useContext(GlobalPhotoContext);
  
  const [callInstance, setCallInstance] = useState(null);

  useEffect(() => {
    if (!sessionUrl) return;

    setCallInstance((prevInstance) => {
      if (!prevInstance && !Daily.callInstance) {
        console.log("✅ Creating a new Daily call instance...");
        return Daily.createCallObject();
      }
      console.warn("⚠️ Daily call instance already exists.");
      return prevInstance;
    });
    
  
    // Request microphone access
    const requestPermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("✅ Microphone access granted.");
      } catch (error) {
        console.error("❌ Failed to get microphone access:", error);
      }
    };
  
    requestPermissions();
  
    // Cleanup: Stop screen share and clear interval when session ends
    return () => {
      stopScreenShare();
      interval && clearInterval(interval);
    };
  }, [sessionUrl]);
  
  useEffect(() => {
    if (!callInstance) return;
    
  
    const handleNewParticipants = (event) => {
      console.log("👀 Participant event:", event);
  
      // Find the trainer (assumes trainer has a video stream)
      const trainerParticipant = Object.values(callInstance.participants()).find(
        (p) => p?.videoTrack && !p?.local // Ensure it's not the student
      );
  
      if (trainerParticipant) {
  
        // Find or create the container div
        let trainerContainer = document.getElementById("bottom-nav-trainerVideo");
        if (!trainerContainer) {
          trainerContainer = document.createElement("div");
          trainerContainer.id = "bottom-nav-trainerVideo";
  
          // Append to the bottom-nav-menu div
          const bottomNav = document.querySelector(".bottom-nav-menu");
          if (bottomNav) {
            bottomNav.appendChild(trainerContainer);
          }
        }
  
        // Find or create the trainer video element
        let trainerVideo = document.getElementById("trainerVideo");
        if (!trainerVideo) {
          trainerVideo = document.createElement("video");
          trainerVideo.id = "trainerVideo";
          trainerVideo.autoplay = true;
          trainerVideo.playsInline = true;
          trainerVideo.muted = false;
          
          // Append video inside the container div
          trainerContainer.appendChild(trainerVideo);
        }
  
        // Attach the trainer's video stream
        const mediaStream = new MediaStream();
        setLoginName("Trainer XXX");
      if (trainerParticipant.videoTrack) {
        mediaStream.addTrack(trainerParticipant.videoTrack);
        console.log("📹 Video track attached.");
      }
      if (trainerParticipant.audioTrack) {
        mediaStream.addTrack(trainerParticipant.audioTrack);
        console.log("🎤 Audio track attached.");
      } else {
        console.warn("⚠️ Trainer has no audio track.");
      }
      trainerVideo.srcObject = mediaStream;
      }
    };
  
    // Listen for participant updates
    callInstance.on("participant-updated", handleNewParticipants);
    callInstance.on("participant-joined", handleNewParticipants);
  
    return () => {
      callInstance.off("participant-updated", handleNewParticipants);
      callInstance.off("participant-joined", handleNewParticipants);
    };
  }, [callInstance]);
  
  

  useEffect(() => {
    if (!sessionUrl) return; // Stop updates if room is already created
  
    console.log("🔄 Starting meeting status updates...");
  
    let interval = setInterval(async () => {
      const updatedMeetingState = await GoliveMeetingStatus(sessionUrl, DAILY_API_KEY);
      if (updatedMeetingState) {
        setMeetingState(updatedMeetingState);
        
        // If room is created, stop updates and auto-click "Start Live Session"
        if (updatedMeetingState.roomCreated) {
          console.log("✅ Room is created. Stopping meeting state updates.");
          interval && clearInterval(interval);
  
          setTimeout(() => {
            const goliveButton = document.querySelector("#goliveButton");
            if (goliveButton) {
              console.log("🎯 Auto-clicking 'Start Live Session' after 1 second...");
              goliveButton.click();
            }
          }, 1000); // Delay auto-click by 1 second
        }
      }
    }, 5000);
  
    return () => {
      interval && clearInterval(interval);
    };
  }, [sessionUrl, meetingState.roomCreated]); // Dependencies
  

  const handleGoLive = async () => {
          if (!sessionUrl) {
            console.error("❌ No session URL available.");
            return;
          }

          console.log("📡 Joining Daily.co session and starting screen share...");

          try {
            if (!callInstance) {
              console.warn("⚠️ No Daily instance available. Trying to use existing instance...");
              const existingInstance = Daily.callInstance || Daily.createCallObject();
              setCallInstance(existingInstance);
            }

              await callInstance.join({
                  url: sessionUrl,
                  userName: "Kiosk",
                  videoSource: false, // 🚀 Disable camera, enable only screen share + mic
                  audioSource: true,
                  subscribeToTracksAutomatically: true,
              });

              console.log("✅ Joined the room successfully.");

              // ✅ Start screen sharing with smart scaling and noise control
              await callInstance.startScreenShare({
                  displayMediaOptions: {
                      audio: {
                          echoCancellation: true,
                          noiseSuppression: true,
                          autoGainControl: true,
                      },
                      selfBrowserSurface: "include",
                      surfaceSwitching: "exclude",
                      systemAudio: "include",
                      video: {
                          width: 1280,
                          height: 720,
                          frameRate: { ideal: 30, max: 60 }, // Smart scaling
                          displaySurface: "browser", // ✅ Forces sharing only the browser tab
                      },
                  },
                  screenVideoSendSettings: "motion-and-detail-balanced",
              });

              console.log("✅ Screen sharing started successfully.");
          } catch (error) {
              console.error("❌ Error joining the room or starting screen share:", error);
          }

          setIsLive(true);
      };
      
      const stopScreenShare = async () => {
        if (callInstance) {
          try {
            const localParticipant = callInstance.participants()?.local;
            
            if (localParticipant?.tracks?.screenVideo) {
              await callInstance.stopScreenShare();
              console.log("🔹 Stopped screen sharing.");
            }
      
            await callInstance.leave();
            callInstance.destroy();
            setCallInstance(null);
            console.log("✅ Call instance cleaned up.");
          } catch (error) {
            console.error("❌ Error stopping screen share:", error);
          }
        } else {
          console.warn("⚠️ No active call instance found.");
        }
      };
      

  return (
    <Layout title="Live Training" description="Live session started">
      {!isLive && (
        <div id="golive-waitingRoom">

            <button id="goliveButton" onClick={handleGoLive}>
            🎥
            </button>
        </div>
      )}
      {isLive && (
        <div id="golive-meetingRoom">
          <h2>🎥</h2>
        </div>
      )}
    </Layout>
  );
};

export default GoLive;
