import React, { useEffect, useRef, useState } from "react";
import {
  FaceDetector,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
import Layout from "@theme/Layout";
import { useHistory } from "react-router-dom";

const FaceDetection = () => {
  const [faceDetector, setFaceDetector] = useState(null);
  const [runningMode, setRunningMode] = useState("IMAGE");
  const [counter, setCounter] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    const initializeFaceDetector = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        const detector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
            delegate: "GPU",
          },
          runningMode: runningMode,
        });
        setFaceDetector(detector);
      } catch (error) {
        console.error("Error initializing face detector:", error);
      }
    };

    initializeFaceDetector();
  }, [runningMode]);

  useEffect(() => {
    if (faceDetector) {
      enableCam();
    }
  }, [faceDetector]);

  const enableCam = async () => {
    const video = videoRef.current;

    if (!video) {
      console.error("Video element is not available.");
      return;
    }

    const constraints = {
      video: true,
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        predictWebcam();
      };
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const predictWebcam = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!video || !ctx) {
      console.error("Video or canvas element is not available.");
      return;
    }

    if (runningMode === "IMAGE") {
      setRunningMode("VIDEO");
      await faceDetector.setOptions({ runningMode: "VIDEO" });
    }

    const startTimeMs = performance.now();

    try {
      const detections = faceDetector.detectForVideo(video, startTimeMs).detections;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections.length > 0) {
        const detection = detections[0];
        const confidence = detection.categories[0].score;

        if (confidence > 0.6) {
          setCounter((prev) => prev + 1);
          ctx.font = "30px Arial";
          ctx.fillStyle = "green";
          ctx.fillText("✅ Checked", 50, 50);
        } else {
          setCounter(0);
        }

        if (counter >= 3) {
          const button = document.querySelector(".face-login-button");
          if (button) {
            button.textContent = "Login Success!";
            button.style.animation = "none";
          }
          setTimeout(() => {
            history.go(-1);
          }, 1000);
        }
      } else {
        setCounter(0);
      }
    } catch (error) {
      console.error("Error during prediction:", error);
    }

    requestAnimationFrame(predictWebcam);
  };

  useEffect(() => {
    const button = document.querySelector(".face-login-button");
    if (button) {
      button.textContent = "Pending...";
    }
  }, []);

  return (
    <Layout title="Log-In Detection" description="via FaceCam for seamless log-in">
      <section className="faceCam-view">
        <video
          id="webcam"
          autoPlay
          playsInline
          ref={videoRef}
          className="faceCam-video"
        ></video>
        <canvas
          ref={canvasRef}
          className="faceCam-canvas"
        ></canvas>
      </section>
    </Layout>
  );
};

export default FaceDetection;
