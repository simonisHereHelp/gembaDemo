import React, { useEffect, useRef, useState, useContext } from "react";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import Layout from "@theme/Layout";
import { useHistory } from "react-router-dom";
import { GlobalPhotoContext } from "../theme/Root";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const [detectionComplete, setDetectionComplete] = useState(false);
  const videoRef = useRef(null);
  const history = useHistory();
  const { loginName, setLoginName, loginReturnLoc, faceCam } = useContext(GlobalPhotoContext);
  const threshold = 0.7;
  let isPredicting = false;

  const markdownTable = `
  | Field       | Value                |
  |------------------|------------------------------|
  | Name        | ${loginName || "N/A"}. (other information here) |
  | Onboard Date|  information ............ |
  | Title       |             |
  | Department  |        |
  | Contact     |         |
  `;

  useEffect(() => {
    const loadFaceDetector = async () => {

      if (!faceCam) {
        history.push('/setupWebcam');
        return;
      }

      try {
        const bottomNav = document.querySelector('.bottom-nav-menu');
        if (bottomNav) {
          bottomNav.style.display = 'none';
        }    
        const detector = await initializeFaceDetector();
        setFaceDetector(detector);
      } catch (error) {
        console.error("Failed to load face detector:", error);
      }
    };

    loadFaceDetector();
  }, [faceCam, history]);

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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: faceCam } }, // Use faceCam for video stream
      });
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        predictWebcam();
      };
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

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

  const handleButtonClick = () => {
    const bottomNav = document.querySelector('.bottom-nav-menu');
    bottomNav.style.display = 'flex';
    if (loginReturnLoc) {
      history.push(loginReturnLoc);
    } else {
      history.push("/");
    }
  };

  useEffect(() => {
    const bottomNav = document.querySelector('.bottom-nav-menu');
    if (counter + counterFail >= 10) {
      const randomId = loginName || `Operator #S${Math.floor(100 + Math.random() * 900)}`;
      setLoginName(counter > counterFail ? randomId : null);
      bottomNav.style.display = 'none'; // Hide the bottom nav menu
      setDetectionComplete(true);

      setTimeout(() => {
        const button = document.querySelector('#result button'); // Select the button in the result section
        if (button) {
          button.click(); // Programmatically trigger the button click
        }
      }, 2500);
    }
  }, [counter, counterFail]);

  return (
    <Layout title="Log-In Detection" description="via FaceCam for seamless log-in">
      {!detectionComplete ? (
        <section id="webvideo" className="faceCam-view">
          <h2></h2>
          <h2>Initializing Webcam...</h2>
          {faceCam && <p>(device seq #: {faceCam.slice(0, 5)})</p>}
          <div className="video-container">
            <video
              id="webcam"
              autoPlay
              playsInline
              ref={videoRef}
              className="faceCam-video"
            ></video>
          </div>
        </section>
      ) : (
        <section id="result" className="result-view">
          <h3>{loginName ? `Login Successful` : "Login Unsuccessful"}</h3>
          <h4>{loginName ? `User: ${loginName}` : "ID Not Found"}</h4>
          <div style={{ width: '60%', margin: '0 auto' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownTable}</ReactMarkdown>
          </div>
          <p></p>
          <button className="passiveButton" onClick={handleButtonClick}>return to previous page...</button>
        </section>
      )}
    </Layout>
  );
};

export default FaceDetection;
