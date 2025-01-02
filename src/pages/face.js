import React, { useEffect, useRef, useState, useContext } from "react";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import Layout from "@theme/Layout";
import { useHistory } from "react-router-dom";
import { GlobalPhotoContext } from "../theme/Root";
import loginIcon from "@site/static/img/log-in.png";
import badge from "@site/static/img/badge.png";

let faceDetectorInstance = null; // Global instance for reuse

const initializeFaceDetector = async () => {
  if (faceDetectorInstance) return faceDetectorInstance; // Return existing instance

  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    faceDetectorInstance = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
        delegate: "GPU",
      },
      runningMode: "IMAGE",
    });
    return faceDetectorInstance;
  } catch (error) {
    console.error("Error initializing face detector:", error);
    throw error;
  }
};

const FaceDetection = () => {
  const [runningMode, setRunningMode] = useState("IMAGE");
  const [counter, setCounter] = useState(0);
  const [counterFail, setCounterFail] = useState(0);
  const [faceDetector, setFaceDetector] = useState(null);
  const [detectionComplete, setDetectionComplete] = useState(false); // New state for detection completion
  const videoRef = useRef(null);
  const history = useHistory();
  const { loginName, setLoginName, loginReturnLoc } = useContext(GlobalPhotoContext); // Access the global state
  const threshold = 0.7;

  useEffect(() => {
    const loadFaceDetector = async () => {
      try {
        const detector = await initializeFaceDetector();
        setFaceDetector(detector);
      } catch (error) {
        console.error("Failed to load face detector:", error);
      }
    };

    loadFaceDetector();
  }, []);

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

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        predictWebcam();
      };
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  let isPredicting = false;
  const predictWebcam = async () => {
    if (!faceDetector || !videoRef.current || isPredicting) return;

    isPredicting = true;
    const video = videoRef.current;
    const startTimeMs = performance.now();

    try {
      if (runningMode === "IMAGE") {
        setRunningMode("VIDEO");
        await faceDetector.setOptions({ runningMode: "VIDEO" });
      }

      const detections = faceDetector.detectForVideo(video, startTimeMs).detections;

      if (detections.length > 0) {
        const detection = detections[0];
        const confidence = detection.categories[0].score;

        if (confidence > threshold) {
          setCounter((prev) => prev + 1);
        } else {
          setCounterFail((prev) => prev + 1);
        }
      } else {
        setCounterFail((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error during prediction:", error);
    } finally {
      isPredicting = false;
      requestAnimationFrame(predictWebcam);
    }
  };

  const releaseFaceDetector = async () => {
    if (faceDetector) {
      try {
        await faceDetector.close(); // Release WebAssembly resources
        console.log("Face detector resources released.");
      } catch (error) {
        console.error("Error releasing face detector resources:", error);
      }
    }
  };

  const handleButtonClick = async () => {
    await releaseFaceDetector(); // Ensure face detector is fully released
    const randomId = loginName || `Operator #S${Math.floor(100 + Math.random() * 900)}`;
    setLoginName(counter > counterFail ? randomId : null);

    if (loginReturnLoc) {
      history.push(loginReturnLoc);
    } else {
      history.push("/");
    }
  };

  useEffect(() => {
    if (counter + counterFail >= 5) {
      setDetectionComplete(true); // Detection is complete
    }
  }, [counter, counterFail]);

  return (
    <Layout title="Log-In Detection" description="via FaceCam for seamless log-in">
      <section className="faceCam-view">
        <img src={loginIcon} alt="Login Icon" className="login-icon" />
        <h2>Initializing Webcam...</h2>
        <div className="video-container">
          <video
            id="webcam"
            autoPlay
            playsInline
            ref={videoRef}
            className="faceCam-video"
          ></video>
          <img src={badge} alt="Badge" className="flicker-badge" />
        </div>
        {detectionComplete && (
          <button className="return-button" onClick={handleButtonClick}>
            Click to Return
          </button>
        )}
      </section>
    </Layout>
  );
};

export default FaceDetection;
