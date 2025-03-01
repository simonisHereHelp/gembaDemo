import React, { useState, useEffect } from "react";
import fetchIP from "@site/src/components/fetch_ip";
import useWebSocket from "react-use-websocket";
import Layout from "@theme/Layout";
import jetsonBoardImg from "@site/static/img/jetsonBoard.jpg";

export default function NanoWeb() {
  const [message, setMessage] = useState("Connecting...");
  const [nanoIP, setNanoIP] = useState("");
  const [socketUrl, setSocketUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isValidIP, setIsValidIP] = useState(false); // ✅ Track if IP is real

  useEffect(() => {
    fetchIP().then(ip => {
      console.log("🔍 [DEBUG] Fetched IP from Firebase:", ip);  // ✅ Debugging: Log IP in Console

      if (!ip || ip === "localhost") {
        setError("❌ Invalid IP retrieved from Firebase!");
        return;
      }

      setNanoIP(ip);
      validateIP(ip); // ✅ Check if IP is reachable
    }).catch(err => {
      setError("❌ Failed to fetch IP: " + err.message);
    });
  }, []);

  // ✅ Function to test if the IP is valid
  const validateIP = async (ip) => {
    try {
      console.log("🔍 [DEBUG] Validating WebSocket at:", `ws://${ip}:8765`);
      
      const testSocket = new WebSocket(`ws://${ip}:8765`);
  
      testSocket.onopen = () => {
        console.log("✅ WebSocket is valid and reachable:", ip);
        setIsValidIP(true);
        setSocketUrl(`ws://${ip}:8765`);
        testSocket.close();
      };
  
      testSocket.onerror = (err) => {
        console.error("❌ WebSocket unreachable:", err);
        setError(`Fake or unreachable IP: ${ip}`);
      };
  
    } catch (error) {
      console.error("❌ WebSocket Connection Failed:", error);
      setError(`WebSocket Connection Failed: ${error.message}`);
    }
  };
  

  const { sendMessage } = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log("✅ [DEBUG] WebSocket Connected:", socketUrl);
      setMessage("Connected to WebSocket");
    },
    onMessage: (event) => {
      console.log("📩 [DEBUG] WebSocket Message Received:", event.data);
      setMessage(event.data);
    },
    onError: (event) => {
      console.error("❌ [DEBUG] WebSocket Error:", event);
      setError("WebSocket Error: " + event.message);
    },
    onClose: () => {
      console.warn("⚠️ [DEBUG] WebSocket Disconnected!");
      setError("WebSocket Disconnected");
    }
  }, isValidIP); // ✅ Only enable WebSocket if IP is valid

  return (
    <Layout title="Jetson Board" description="Edge AI session started">
      <div className="container">
        <h1>Jetson Nano WebSocket Dashboard</h1>
        <img src={jetsonBoardImg} />
        <p><strong>Jetson Nano IP:</strong> {nanoIP || "Fetching..."}</p>
        <p><strong>Status:</strong> {message}</p>

        {error && <p style={{ color: "red" }}><strong>ERROR:</strong> {error}</p>} {/* ✅ Show error if exists */}

        <button onClick={() => sendMessage("Ping")} disabled={!isValidIP}>Send Ping</button>
      </div>
    </Layout>
  );
}
