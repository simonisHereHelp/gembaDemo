import React, { useEffect, useRef, useState } from "react";
import {
  FaceDetector,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
import Layout from "@theme/Layout"; // Import Docusaurus Layout component

const FaceDetection = () => {
  const [faceDetector, setFaceDetector] = useState(null);
  const [runningMode, setRunningMode] = useState("IMAGE");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize the face detector
  useEffect(() => {
    console.log("Initializing face detector...");
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
        console.log("Face detector initialized successfully!");
      } catch (error) {
        console.error("Error initializing face detector:", error);
      }
    };

    initializeFaceDetector();
  }, [runningMode]);

  // Automatically enable the webcam when the page loads
  useEffect(() => {
    if (faceDetector) {
      console.log("Face detector is ready. Enabling webcam...");
      enableCam();
    } else {
      console.log("Face detector is not ready yet.");
    }
  }, [faceDetector]);

  // Start webcam and enable face detection
  const enableCam = async () => {
    console.log("Requesting webcam access...");
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
        console.log("Webcam feed is active. Starting predictions...");
        predictWebcam();
      };
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const predictWebcam = async () => {
    const video = videoRef.current;

    if (!video) {
      console.error("Video element is not available.");
      return;
    }

    console.log("Video Width:", video.videoWidth, "Video Height:", video.videoHeight);

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("Invalid video dimensions. Ensure the webcam feed is active.");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (runningMode === "IMAGE") {
      setRunningMode("VIDEO");
      await faceDetector.setOptions({ runningMode: "VIDEO" });
      console.log("Switching face detector to VIDEO mode.");
    }

    const startTimeMs = performance.now();
    try {
      const detections = faceDetector.detectForVideo(video, startTimeMs).detections;
      console.log("Detections:", detections);

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections.length > 0) {
        const detection = detections[0]; // Use the first detected face
        const confidence = detection.categories[0].score;

          console.log("Face detected with confidence:", confidence);
          // Draw the "Checked" text on the canvas
          ctx.font = "30px Arial";
          ctx.fillStyle = "green";
          ctx.fillText("Checked", 50, 50); // Adjust position as needed
      } else {
        console.log("No faces detected.");
      }
    } catch (error) {
      console.error("Error during prediction:", error);
    }

    requestAnimationFrame(predictWebcam);
  };

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
