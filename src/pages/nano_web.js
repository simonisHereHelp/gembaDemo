import React, { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import Layout from "@theme/Layout";
import jetsonBoardImg from "@site/static/img/jetsonBoard.jpg";

export default function NanoWeb() {
  const [message, setMessage] = useState("Connecting...");
  const [socketUrl, setSocketUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isValidIP, setIsValidIP] = useState(false);

  useEffect(() => {
    const wsUrl = "wss://nano.ishere.help/websocket"; // ✅ Linked via Cloudflare Tunnel
    setSocketUrl(wsUrl);
    validateWebSocket(wsUrl);
  }, []);

  const validateWebSocket = (wsUrl) => {
    try {
      console.log("🔍 [DEBUG] Validating WebSocket at:", wsUrl);
      const testSocket = new WebSocket(wsUrl);
      testSocket.onopen = () => {
        console.log("✅ WebSocket is reachable via Cloudflare Tunnel:", wsUrl);
        setIsValidIP(true);
        testSocket.close();
      };
      testSocket.onerror = (err) => {
        console.error("❌ WebSocket unreachable via Cloudflare Tunnel:", err);
        setError(`WebSocket unreachable at ${wsUrl}`);
      };
    } catch (error) {
      console.error("❌ WebSocket Connection Failed:", error);
      setError(`WebSocket Connection Failed: ${error.message}`);
    }
  };

  const { sendMessage } = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log("✅ [DEBUG] WebSocket Connected via Cloudflare Tunnel:", socketUrl);
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
  }, isValidIP);

  return (
    <Layout title="Jetson Board" description="Edge AI session started">
      <div className="container">
        <h1>Jetson Nano WebSocket Dashboard (Ubuntu-Websocket)</h1>
        <img src={jetsonBoardImg} alt="Jetson Board"/>
        <p><strong>WebSocket URL:</strong> {socketUrl || "Loading..."}</p>
        <p><strong>Status:</strong> {message}</p>
        {error && <p style={{ color: "red" }}><strong>ERROR:</strong> {error}</p>}
        <button onClick={() => sendMessage("Ping")} disabled={!isValidIP}>Send Ping</button>
      </div>
    </Layout>
  );
}