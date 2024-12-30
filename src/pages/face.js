import React, { useEffect, useRef, useState } from "react";
import {
  FaceDetector,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
import Layout from "@theme/Layout";
import { useHistory, useLocation } from "react-router-dom";

const FaceDetection = () => {
  const [faceDetector, setFaceDetector] = useState(null);
  const [runningMode, setRunningMode] = useState("IMAGE");
  const [counter, setCounter] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true); // Track initialization
  const [terminated, setTerminated] = useState(false);
  const videoRef = useRef(null);
  const history = useHistory();
  const location = useLocation();

  // Initialize the face detector
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

  // Automatically enable the webcam when the detector is ready
  useEffect(() => {
    if (faceDetector) {
      enableCam();
    }
  }, [faceDetector]);

  // Enable webcam feed and start predictions
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

  // Predict webcam feed
  const predictWebcam = async () => {
    const video = videoRef.current;

    if (!video || terminated) {
      return; // Exit if the component is terminated
    }

    if (runningMode === "IMAGE") {
      setRunningMode("VIDEO");
      await faceDetector.setOptions({ runningMode: "VIDEO" });
    }

    const startTimeMs = performance.now();

    try {
      const detections = faceDetector.detectForVideo(video, startTimeMs).detections;

      // Mark initialization as complete when predictions start
      setIsInitializing(false);

      if (detections.length > 0) {
        const detection = detections[0];
        const confidence = detection.categories[0].score;

        if (confidence > 0.7) {
          setCounter((prev) => prev + 1);
        } else {
          setCounter(0);
        }
      } else {
        setCounter(0);
      }
    } catch (error) {
      console.error("Error during prediction:", error);
    }

    requestAnimationFrame(predictWebcam);
  };

  // React to counter changes
  useEffect(() => {
    const button = document.querySelector(".face-login-button");

    if (counter >= 3 && !terminated) {
      if (button) {
        button.textContent = "Login Success!";
        button.style.animation = "none"; // Stop pending animation
      }
      history.go(-1); // Navigate back to the previous page
    } else if (counter === 0 && button) {
      button.textContent = "Pending...";
    }
  }, [counter, history, terminated]);

  if (terminated) {
    return null; // Render nothing when terminated
  }

  return (
    <Layout title="Log-In Detection" description="via FaceCam for seamless log-in">
      {isInitializing ? (
        <h2>Initializing Webcam...</h2>
      ) : (<h2>Log-In Detection</h2>)}
        <>
          <section className="faceCam-view">
            <video
              id="webcam"
              autoPlay
              playsInline
              ref={videoRef}
              className="faceCam-video"
            ></video>
          </section>
        </>

    </Layout>
  );
};

export default FaceDetection;
