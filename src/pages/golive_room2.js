import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import "./golive.css";
import Layout from "@theme/Layout";
import { GoliveMeetingStatus } from "../components/golive-meetingStatus";
import Daily from "@daily-co/daily-js";
import { GlobalPhotoContext } from "../theme/Root";

const DAILY_API_KEY = "373a39750ce5b3f4d805c5b7dcfd84a661137ea513f3e748497805a7a0f8225b";

const GoLive2 = () => {
  const trainerName = "Trainer";
  const sessionUrl = "https://gembaly.daily.co/room_01";
  const [meetingState, setMeetingState] = useState({ roomCreated: false, activeTime: "--", duration: "--" });
  const [isLive, setIsLive] = useState(false);
  const { loginReturnLoc, loginName, setLoginName } = useContext(GlobalPhotoContext);
  const history = useHistory();
  const pushPath = "docs/wi1/wi-71";
  const [callInstance, setCallInstance] = useState(null);

  useEffect(() => {
    if (!sessionUrl) return;

    setCallInstance((prevInstance) => {
      if (!prevInstance) {
        console.log("✅ Creating a new Daily call instance...");
        return Daily.createCallObject();
      }
      console.warn("⚠️ Daily call instance already exists.");
      return prevInstance;
    });

    // Request microphone access
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => console.log("✅ Microphone access granted."))
      .catch(error => console.error("❌ Failed to get microphone access:", error));

    return () => {
      stopScreenShare();
    };
  }, [sessionUrl]);

  useEffect(() => {
    if (!callInstance) return;

    const handleNewParticipants = (event) => {
      console.log("👀 Participant event:", event);

      const trainerParticipant = Object.values(callInstance.participants()).find(
        (p) => p?.videoTrack && !p?.local
      );

      if (trainerParticipant) {
        let trainerContainer = document.getElementById("bottom-nav-trainerVideo");
        if (!trainerContainer) {
          trainerContainer = document.createElement("div");
          trainerContainer.id = "bottom-nav-trainerVideo";
          const bottomNav = document.querySelector(".bottom-nav-menu");
          if (bottomNav) bottomNav.appendChild(trainerContainer);
        }

        let trainerVideo = document.getElementById("trainerVideo");
        if (!trainerVideo) {
          trainerVideo = document.createElement("video");
          trainerVideo.id = "trainerVideo";
          trainerVideo.autoplay = true;
          trainerVideo.playsInline = true;
          trainerVideo.muted = false;
          trainerContainer.appendChild(trainerVideo);
        }

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
        setTimeout(() => history.push(pushPath), 500);
      }
    };

    callInstance.on("participant-updated", handleNewParticipants);
    callInstance.on("participant-joined", handleNewParticipants);

    return () => {
      callInstance.off("participant-updated", handleNewParticipants);
      callInstance.off("participant-joined", handleNewParticipants);
    };
  }, [callInstance]);

  useEffect(() => {
    if (!sessionUrl) return;

    console.log("🔄 Starting meeting status updates...");

    let interval = setInterval(async () => {
      const updatedMeetingState = await GoliveMeetingStatus(sessionUrl, DAILY_API_KEY);
      if (updatedMeetingState) {
        setMeetingState(updatedMeetingState);

        if (updatedMeetingState.roomCreated) {
          console.log("✅ Room is created. Stopping meeting state updates.");
          clearInterval(interval);

          setTimeout(() => {
            const goliveButton = document.querySelector("#goliveButton");
            if (goliveButton) {
              console.log("🎯 Auto-clicking 'Start Live Session' after 1 second...");
              goliveButton.click();
            }
          }, 1000);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [sessionUrl, meetingState.roomCreated]);

  const handleGoLive = async () => {
    if (!sessionUrl) {
      console.error("❌ No session URL available.");
      return;
    }

    console.log("📡 Joining Daily.co session and starting screen share...");

    try {
      if (!callInstance) {
        console.warn("⚠️ No Daily instance available. Trying to use existing instance...");
        setCallInstance((prevInstance) => prevInstance || Daily.createCallObject());
      }

      await callInstance.join({
        url: sessionUrl,
        userName: "Kiosk",
        videoSource: false, // 🚀 Disable camera, enable only screen share + mic
        audioSource: true,
        subscribeToTracksAutomatically: true,
      });

      console.log("✅ Joined the room successfully.");

      // ✅ Capture and share default video.track[0]
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      await callInstance.setInputDevicesAsync({
        videoSource: stream.getVideoTracks()[0], // ✅ Sharing default video.track[0]
        audioSource: stream.getAudioTracks()[0],
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

export default GoLive2;
