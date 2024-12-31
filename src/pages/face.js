import React, { useEffect, useRef, useState, useContext } from "react";
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import Layout from "@theme/Layout";
import { useHistory} from "react-router-dom";
import { GlobalPhotoContext } from "../theme/Root";
import loginIcon from '@site/static/img/log-in.png'

const FaceDetection = () => {
  const [faceDetector, setFaceDetector] = useState(null);
  const [runningMode, setRunningMode] = useState("IMAGE");
  const [counter, setCounter] = useState(0);
  const [counterFail, setCounterFail] = useState(0);
  const videoRef = useRef(null);
  const history = useHistory();
  const { loginName, setLoginName, loginReturnLoc} = useContext(GlobalPhotoContext); // Access the global state
  const threshold = 0.7;


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
      console.log('detections ',detections)

      if (detections.length > 0) {
        const detection = detections[0];
        const confidence = detection.categories[0].score;

        if (confidence > threshold) {
          setCounter((prev) => prev + 1);
        } else {
          setCounterFail((prev) => prev + 1);;
        }
      } else {
        setCounterFail((prev) => prev + 1);;
      }
    } catch (error) {
      console.error("Error during prediction:", error);
    }

    requestAnimationFrame(predictWebcam);
  };

  useEffect(() => {
    if (counter + counterFail >= 5) {
      const randomId = loginName || `Operator #S${Math.floor(100 + Math.random() * 900)}`;
      setLoginName(counter > counterFail ? randomId :  null );
      setTimeout(() => {
        if (loginReturnLoc) {
          history.push(loginReturnLoc);
        } else {
          history.push("/");
        }
      }, 500); // Small delay to allow UI updates
    }
  }, [counter, counterFail]);
  
 

  return (
    <Layout title="Log-In Detection" description="via FaceCam for seamless log-in">
        <>
          <section className="faceCam-view">
          <img
          src={loginIcon}
          alt="Login Icon"
          style={{
            display: 'block',
            margin: '10px auto',
            width: '80px',
            height: '80px',
          }}
          />
            <h2>Initializing Webcam...</h2>
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
