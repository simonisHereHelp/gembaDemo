import React, { useEffect, useRef, useState, useContext } from "react";
import {
  FaceDetector,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
import Layout from "@theme/Layout";
import { useHistory} from "react-router-dom";
import { GlobalPhotoContext } from "../theme/Root";
import swishSound from '@site/static/img/swoosh.mp3'
const FaceDetection = () => {
  const [faceDetector, setFaceDetector] = useState(null);
  const [runningMode, setRunningMode] = useState("IMAGE");
  const [counter, setCounter] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true); // Track initialization
  const videoRef = useRef(null);
  const history = useHistory();
  const { loginName,setLoginName } = useContext(GlobalPhotoContext); // Access the global state
  const swishAudio = useRef(new Audio(swishSound));
  useEffect(() => {
    // Play swish audio on mount
    swishAudio.current.currentTime = 0;
    swishAudio.current.play();
  }, []); // Empty dependency array ensures this runs only once
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

    if (!video) {
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

  useEffect(() => {
    if (counter >= 3) {
      const randomId = loginName || `User ${Math.floor(100 + Math.random() * 900)}`; // Use existing loginName or generate a new one
      setLoginName(`User ${randomId}`);
      setTimeout(() => {
        if (history.length > 1) {
          history.go(-1);
        } else {
          history.push("/");
        }
        swishAudio.current.currentTime = 0;
        swishAudio.current.play();
      }, 500); // Small delay to allow UI updates
    }
  }, [counter, history, setLoginName]);
 

  return (
    <Layout title="Log-In Detection" description="via FaceCam for seamless log-in">
        <>
          <section className="faceCam-view">
          {isInitializing ? (
              <h2>Initializing Webcam...</h2>
            ) : (<h2>Log-In Detection</h2>)}
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
