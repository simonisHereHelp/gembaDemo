const setupCompositeCameraView = async (setStream1, setStream2, canvasRef, videoContainerRef) => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter((device) => device.kind === "videoinput");

  if (videoDevices.length < 2) {
    console.warn("At least two video devices are required for this setup.");
    return { deviceName1: "N/A", deviceName2: "N/A" };
  }

  const [videoStream1, videoStream2] = await Promise.all([
    navigator.mediaDevices.getUserMedia({ video: { deviceId: videoDevices[0].deviceId } }),
    navigator.mediaDevices.getUserMedia({ video: { deviceId: videoDevices[1].deviceId } }),
  ]);

  setStream1(videoStream1);
  setStream2(videoStream2);

  const deviceName1 = videoDevices[0].label || "Unknown Device 1";
  const deviceName2 = videoDevices[1].label || "Unknown Device 2";

  const video1 = document.createElement("video");
  const video2 = document.createElement("video");
  video1.srcObject = videoStream1;
  video2.srcObject = videoStream2;

  await Promise.all([video1.play(), video2.play()]);

  const canvas = document.createElement("canvas");
  canvas.width = 960 * 2;
  canvas.height = 640;
  canvasRef.current = canvas;
  const ctx = canvas.getContext("2d");

  const drawFrame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video1, 0, 0, canvas.width / 2, canvas.height);
    ctx.drawImage(video2, canvas.width / 2, 0, canvas.width / 2, canvas.height);
    requestAnimationFrame(drawFrame);
  };
  drawFrame();

  const combinedStream = canvas.captureStream(30);
  videoContainerRef.current.srcObject = combinedStream;

  return { deviceName1, deviceName2, combinedStream };

};

export { setupCompositeCameraView };
