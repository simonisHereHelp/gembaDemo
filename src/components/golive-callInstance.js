import Daily from "@daily-co/daily-js";

let callInstance = null; // Singleton instance for the Daily call object

// Handler for when a participant joins the call
const handleParticipantJoined = (setParticipants) => (event) => {
  const participant = event.participant;
  const { session_id, user_name, local } = participant;

  // Ignore the local participant
  if (local) return;

  // Access the video track
  const videoTrack = participant.tracks?.video?.track;
  if (videoTrack) {
    const videoStream = new MediaStream([videoTrack]);
    const videoElement = document.createElement("video");
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.srcObject = videoStream;

    // Update the participants state
    setParticipants((prevParticipants) => ({
      ...prevParticipants,
      [session_id]: {
        name: user_name || "Guest",
        videoElement,
      },
    }));

    console.log(`Set video element for participant: ${user_name}, session_id: ${session_id}`);
  } else {
    console.warn(`No video track found for participant: ${user_name}, session_id: ${session_id}`);
  }
};

// Handler for when a participant leaves the call
const handleParticipantLeft = (setParticipants) => (event) => {
  const { session_id } = event.participant;

  console.log(`Participant left with session_id: ${session_id}`);

  // Update the participants state
  setParticipants((prevParticipants) => {
    const updatedParticipants = { ...prevParticipants };
    delete updatedParticipants[session_id];
    return updatedParticipants;
  });
};

// Initialize the call instance and setup event listeners
const initializeCallInstance = (setParticipants, roomUrl) => {
  if (callInstance && callInstance.destroyed) {
    callInstance = null;
  }

  if (!callInstance) {
    callInstance = Daily.createCallObject();
  }

  // Store handler instances to ensure the same reference is used
  const participantJoinedHandler = handleParticipantJoined(setParticipants);
  const participantLeftHandler = handleParticipantLeft(setParticipants);

  // Setup event listeners
  callInstance.on("participant-joined", participantJoinedHandler);
  callInstance.on("participant-updated", participantJoinedHandler); // Reuse the joined handler for updates
  callInstance.on("participant-left", participantLeftHandler);

  // Join the room
  const joinRoom = async () => {
    try {
      await callInstance.join({
        url: roomUrl,
        userName: "Work",
      });
      console.log("Joined the room successfully.");
    } catch (error) {
      console.error("Error joining the room:", error);
    }
  };

  joinRoom();
  return callInstance;
};

// Cleanup the call instance and remove event listeners
const cleanupCallInstance = (setParticipants) => {
  if (callInstance) {
    // Retrieve the same handler instances
    const participantJoinedHandler = handleParticipantJoined(setParticipants);
    const participantLeftHandler = handleParticipantLeft(setParticipants);

    // Remove event listeners
    callInstance.off("participant-joined", participantJoinedHandler);
    callInstance.off("participant-updated", participantJoinedHandler);
    callInstance.off("participant-left", participantLeftHandler);

    // Leave and destroy the call instance
    callInstance.leave();
    callInstance.destroy();
    callInstance = null;

    console.log("Call instance cleaned up and destroyed.");
  }
};

// golive-callInstance.js
export { initializeCallInstance, cleanupCallInstance };
