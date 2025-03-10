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
  const [livenessTF, setLivenessTF] = useState(false);
  const videoRef = useRef(null);
  const history = useHistory();
  const { loginReturnLoc, loginName, setLoginName, faceCam } = useContext(GlobalPhotoContext);
  const threshold = 0.7;
  let isPredicting = false;
  const [errorDetected, setErrorDetected] = useState(false); // ✅ New error state

  const markdownTable = `
  |          |                   |
  |-------------------|----------------------------|
  | **Face Camera**   | ${livenessTF ? "✅ Verified" : "❌ Not Detected"} |
  | **Liveness Score** | ${counter > counterFail ? "Pass ✅" : "Fail ❌"} |
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
      setErrorDetected(true); // ✅ Set error if detection fails
    } finally {
      isPredicting = false;
      requestAnimationFrame(predictWebcam);
    }
  };

  const handleButtonClick = () => {

    if (videoRef.current) {
      videoRef.current.pause(); // ⏸ Pause the video
      videoRef.current.srcObject = null; // ❌ Remove video stream
    }
    
    const bottomNav = document.querySelector('.bottom-nav-menu');
    bottomNav.style.display = 'flex';
    if (loginReturnLoc) {
      // history.push('/qr');
      history.push(loginReturnLoc);
    } else {
      history.push("/");
    }
  };

  useEffect(() => {
    const bottomNav = document.querySelector('.bottom-nav-menu');
    if (counter + counterFail >= 10) {
      
      // alternative path: remove setLoginName and go to Step 2 history.push (/qr)
      const randomId = loginName || `Operator #S${Math.floor(100 + Math.random() * 900)}`;
      setLoginName(counter > counterFail ? randomId : null);

      setLivenessTF(counter > counterFail ? true : false);
      bottomNav.style.display = 'none'; // Hide the bottom nav menu
      setDetectionComplete(true);
      setTimeout(() => {
        const button = document.querySelector('#jumpToNext'); // Select the button in the result section
        if (button) {
          button.click(); // Programmatically trigger the button click
        }
      }, 2500);
    }
  }, [counter, counterFail]);
  return (
    <Layout title="Liveness Detection" description="Step 1: Prevent Spoofing with a Live Test">
      {/* 🔹 Step 1: Anti-Spoofing Liveness Detection */}
      <div className="resultResult">
        <h1>🛡 Step 1: Liveness Check</h1>
        {!detectionComplete ? (
          <>
            <p>Look into the camera, do not use a photo.</p>
            <div className="resultVideo">
              <video id="resultVideo" autoPlay playsInline ref={videoRef} className="resultVideoElement"></video>
              {faceCam && <p className="device-info">📷 Camera ID: {faceCam.slice(0, 5)}</p>}
            </div>
          </>
        ) : (
          <>
            {/* 🔹 Transition to Step 2: QR Code Scan */}
            <section className="resultSuccess">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownTable}</ReactMarkdown>
              <button id="jumpToNext" className="resultButton" onClick={handleButtonClick}>
                Back to Page →
              </button>
            </section>
          </>
        )}

      {errorDetected && (
          <div className="resultError">
            <h3>❌ Error: Liveness Test Failed</h3>
            <p>Could not detect a real person within the time limit.</p>
            <button className="resultButton" onClick={() => history.push("/")}>
              Return to Page
            </button>
          </div>
        )}

      </div>
    </Layout>
  );

};

export default FaceDetection;
