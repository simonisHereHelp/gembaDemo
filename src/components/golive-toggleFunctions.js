const toggleVideoStream = (stream, setIsVideoOn) => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        if (track.readyState === "live") {
          track.enabled = !track.enabled;
        }
      });
      setIsVideoOn((prev) => !prev);
    }
  };

  export { toggleVideoStream };