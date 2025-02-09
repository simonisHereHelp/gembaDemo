const DAILY_API_KEY = "373a39750ce5b3f4d805c5b7dcfd84a661137ea513f3e748497805a7a0f8225b";
const checkRoomVacancy = async () => {
  try {
    console.log("🔍 Checking available rooms...");

    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching rooms: ${response.statusText}`);
    }

    const data = await response.json();
    const roomList = data.data.map(room => room.name); // Extract room names

    console.log("📋 Current rooms:", roomList);

    // Check rooms from room_01 to room_05 for vacancy
    for (let i = 1; i <= 5; i++) {
      const roomName = `room_0${i}`;

      // Check if the room exists
      if (roomList.includes(roomName)) {
        const isVacant = await checkRoomPresence(roomName);
        if (isVacant) {
          console.log(`✅ ${roomName} is vacant. Returning existing room.`);
          return `https://gembaly.daily.co/${roomName}`;
        }
      } else {
        // Room does not exist → Create it
        console.log(`✅ ${roomName} does not exist. Creating the room...`);
        return await createDailySession(roomName);
      }
    }

    console.log("⚠️ No vacant rooms found. Creating a new session.");
    return await createDailySession(); // Fallback if all rooms are occupied

  } catch (error) {
    console.error("❌ Error checking room vacancy:", error);
    return null;
  }
};

// Function to check if a room is vacant by using the presence API
const checkRoomPresence = async (roomName) => {
  try {
    const presenceUrl = `https://api.daily.co/v1/rooms/${roomName}/presence`;
    console.log(`🔹 Checking presence for: ${presenceUrl}`);

    const response = await fetch(presenceUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching room presence: ${response.statusText}`);
    }

    const presenceData = await response.json();
    console.log(`📊 Presence Data for ${roomName}:`, presenceData);

    return presenceData.total_count === 0; // Returns true if no one is in the room (vacant)
  } catch (error) {
    console.error(`❌ Error checking presence for ${roomName}:`, error);
    return false;
  }
};

// Function to create a Daily.co session (used when no room is available)
const createDailySession = async (roomName = `session_${Date.now()}`) => {
  try {
    console.log(`🚀 Creating Daily session: ${roomName}`);

    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        privacy: "public",
        properties: {
          enable_chat: true,
          enable_knocking: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Daily session API error:", errorText);
      throw new Error("Failed to create Daily.co session");
    }

    const data = await response.json();
    console.log("✅ Daily session successfully created. URL:", data.url);
    return data.url; // Return the session URL

  } catch (error) {
    console.error("❌ Error creating Daily.co session:", error);
    return null;
  }
};



export { checkRoomVacancy, createDailySession };

