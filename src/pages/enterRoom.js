import React, { useEffect, useState } from "react";
import Layout from "@theme/Layout";
import Daily from "@daily-co/daily-js";

const DAILY_API_KEY = "373a39750ce5b3f4d805c5b7dcfd84a661137ea513f3e748497805a7a0f8225b";

const EnterRoom = () => {
  const sessionUrl = "https://gembaly.daily.co/room_01";
  const [isLive, setIsLive] = useState(false);
  const [callInstance, setCallInstance] = useState(null);

  useEffect(() => {
    // Avoid creating multiple instances
    if (!callInstance) {
      const newCallInstance = Daily.createCallObject();
      setCallInstance(newCallInstance);
      console.log("✅ Call instance created.");
    }
  }, []); // ✅ Empty dependency array ensures this runs only once

  useEffect(() => {
    if (!callInstance) return; // ✅ Prevents unnecessary execution

    const startSession = async () => {
      try {
        await callInstance.join({
          url: sessionUrl,
          userName: "Kiosk",
          videoSource: false,
          audioSource: true,
          subscribeToTracksAutomatically: true,
        });

        console.log("✅ Joined the room successfully.");

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
              frameRate: { ideal: 30, max: 60 },
              displaySurface: "browser",
            },
          },
          screenVideoSendSettings: "motion-and-detail-balanced",
        });

        console.log("✅ Screen sharing started successfully.");
        setIsLive(true);
      } catch (error) {
        console.error("❌ Error joining the room or starting screen share:", error);
      }
    };

    startSession();
  }, [callInstance]); // ✅ Runs only when `callInstance` is set

  return (
    <Layout title="Live Training" description="Live session started">
      <div id="golive-meetingRoom">
        <h2>{isLive ? "🎥 Live Meeting in Progress" : "🔄 Setting Up Live Session..."}</h2>
      </div>
    </Layout>
  );
};

export default EnterRoom;
