import React, { useState, useEffect } from "react";
import fetchIP from "@site/src/components/fetch_ip";
import useWebSocket from "react-use-websocket";
import Layout from "@theme/Layout";
import jetsonBoardImg from "@site/static/img/jetsonBoard.jpg"
export default function NanoWeb() {
  const [message, setMessage] = useState("Connecting...");
  const [nanoIP, setNanoIP] = useState("");
  const [socketUrl, setSocketUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isValidIP, setIsValidIP] = useState(false); // ✅ Track if IP is real

  useEffect(() => {
    fetchIP().then(ip => {
      console.log("Fetched IP:", ip);  // ✅ Debugging: Log IP in Console

      if (!ip || ip === "localhost") {
        setError("Invalid IP retrieved from Firebase!");
        return;
      }

      setNanoIP(ip);
      validateIP(ip); // ✅ Check if IP is reachable
    }).catch(err => {
      setError("Failed to fetch IP: " + err.message);
    });
  }, []);

  // ✅ Function to test if the IP is valid
  const validateIP = async (ip) => {
    try {
      const response = await fetch(`http://${ip}:8765/ping`, { method: "HEAD" });
      if (response.ok) {
        console.log("✅ IP is reachable:", ip);
        setIsValidIP(true);
        setSocketUrl(`ws://${ip}:8765`);
      } else {
        throw new Error("Server not responding");
      }
    } catch (error) {
      console.error("❌ Fake or unreachable IP:", ip);
      setError(`Fake or unreachable IP: ${ip}`);
    }
  };

  const { sendMessage } = useWebSocket(socketUrl, {
    onOpen: () => setMessage("Connected to WebSocket"),
    onMessage: (event) => setMessage(event.data),
    onError: (event) => setError("WebSocket Error: " + event.message),
  }, isValidIP); // ✅ Only enable WebSocket if IP is valid

  return (
    <Layout title="Jetson Board" description="Edge AI session started">
      <div className="container">
        <h1>Jetson Nano WebSocket Dashboard</h1>
        <img src={jetsonBoardImg}/>
        <p><strong>Jetson Nano IP:</strong> {nanoIP || "Fetching..."}</p>
        <p><strong>Status:</strong> {message}</p>

        {error && <p style={{ color: "red" }}><strong>ERROR:</strong> {error}</p>} {/* ✅ Show error if exists */}

        <button onClick={() => sendMessage("Ping")} disabled={!isValidIP}>Send Ping</button>
      </div>
    </Layout>
  );
}
