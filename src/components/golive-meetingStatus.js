export const GoliveMeetingStatus = async (sessionUrl, DAILY_API_KEY) => { 
    if (!sessionUrl) return null;
  
    const roomName = new URL(sessionUrl).pathname.split("/").pop();
    const presenceUrl = `https://api.daily.co/v1/rooms/${roomName}/presence`;
  
    console.log(`🔹 Fetching presence data from: ${presenceUrl}`);
  
    try {
      const response = await fetch(presenceUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${DAILY_API_KEY}` },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Presence API Error (${response.status}): ${errorText}`);
      }
  
      const presenceData = await response.json();
      console.log("🔹 Presence Data:", presenceData);
  
      // Room is ready if at least one participant is present
      const roomReady = presenceData.total_count > 0;
  
      // Get first active participant (or set default values)
      const firstParticipant = presenceData.data?.[0] || null;
  
      // Format Active Time (MM/DD/YY HH:mm:ss) or "--" if no data
      const activeTime = firstParticipant?.joinTime
        ? new Date(firstParticipant.joinTime).toLocaleString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
        : "--";
  
      // Convert Duration (seconds to minutes)
      const durationMinutes = firstParticipant?.duration
        ? `${Math.floor(firstParticipant.duration / 60)} mins`
        : "--";
  
      const meetingState = {
        roomCreated: roomReady,
        activeTime: activeTime,
        duration: durationMinutes,
      };
  
      console.log("✅ Meeting state updated successfully!", meetingState);
      return meetingState; // ✅ Now returns the meetingState object
    } catch (error) {
      console.error("❌ Error fetching meeting status:", error);
      return null;
    }
  };
  