import React from 'react';
import ReactPlayer from 'react-player';
import './VideoCameraControl.css'; // Import the new CSS file
import captureImage from './CaptureImage';  
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 760;

// Import sound files as constants
import clickSound from '@site/static/img/click.mp3';
import swishSound from '@site/static/img/swoosh.mp3';
import cameraShutterSound from '@site/static/img/camera-shutter.mp3';

class VideoCameraControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: true,  // Initially, the video is not playing
      timer: 0, 
      showPlayPauseButton: true,  // Control the visibility of the play/pause button
    };
    this.playUntil = this.playUntil.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleProgressStop = this.handleProgressStop.bind(this);
    this.handleProgressSeekStart = this.handleProgressSeekStart.bind(this);
    this.toggleView = this.toggleView.bind(this); // Bind toggleView here
    this.initialLaunch = this.initialLaunch.bind(this); // Bind openControlCenter here
    this.playPause = this.playPause.bind(this); // Bind playPause function
    this.canvasRef = React.createRef();
    this.webcamRef = React.createRef();  // Ref for accessing webcam video element
    // Create audio elements for the sounds
    this.clickAudio = new Audio(clickSound);
    this.swishAudio = new Audio(swishSound);
    this.cameraShutterAudio = new Audio(cameraShutterSound);
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  initialLaunch() {
    //intial video and open webcam
    const { setInitialized } = this.props;
    setInitialized(true); 
    this.startWebcam(); 
  }

  playUntil(startTime, endTime) {
    console.log("playUntil ", startTime)
    if (isNaN(startTime) || isNaN(endTime)) {
      console.error("Invalid startTime or endTime provided:", startTime, endTime);
      return;
    }
    if (this.p) { // Ensure the player ref is available
      this.p.seekTo(startTime);  // Seek to the start time
      this.setState({ playing: true });  // Start playback
    } else {
      console.error("Player reference is not available");
    }
  }

  playPause() {
    this.clickAudio.currentTime = 0;
    this.clickAudio.play();
    this.setState((prevState) => ({
      playing: !prevState.playing, // Toggle the playing state
    }));
  }

  startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.webcamRef.current) {
        this.webcamRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing the webcam", err);
    }
  }
  
  // Automatically play the next segment when the component updates (no user interaction needed)
  componentDidUpdate(prevProps) {
    const {initialized, startTime,endTime,chapterId}  = this.props;
    if (initialized &&
        (prevProps.startTime !== startTime || 
         prevProps.endTime !== endTime || 
         prevProps.chapterId !== chapterId)) {
      this.playUntil(parseFloat(startTime), parseFloat(endTime));
  
      if (!this.state.showPlayPauseButton) {
        this.setState({
          showPlayPauseButton: true,
        });
      }
  
      // Only start webcam if it hasn't been started yet
      if (!this.webcamRef.current || !this.webcamRef.current.srcObject) {
        this.startWebcam();
      }
    }
  }
  

  // Stop the video when the progress reaches the endTime
  handleProgress(state) {
    const { startTime, endTime } = this.props;
    const currentPlayTime = state.playedSeconds; // Get the current video time
    // Update the parent with the current playtime
    this.setState({ timer: currentPlayTime });

    // Check if the video has reached the end time
    if (endTime && currentPlayTime >= endTime) {
      this.handleProgressStop();
      this.setState({ showPlayPauseButton: false }); // Hide the play/pause button
    }
    // Check if the current time is less than the start time and video is playing
    if (startTime && currentPlayTime < startTime) {
      this.handleProgressSeekStart()
    }
  }
  handleProgressStop() {
    const { endTime } = this.props;
    if (this.p && endTime) {
      this.setState({ playing: false })
      this.p.seekTo(0); // Reset to the beginning
    }
  }

  handleProgressSeekStart() {
    const { startTime } = this.props;
    if (this.p && startTime) {
      this.p.seekTo(startTime);
    } else {
      console.error("Player reference is not available for seeking");
    }
  }
  
  toggleView() {
    this.swishAudio.currentTime = 0;
    this.swishAudio.play();

    this.setState((prevState) => ({
      isToggled: !prevState.isToggled,  // Toggle between the two sizes locally
    }), () => {
      this.props.setIsToggled(this.state.isToggled);  // Update global isToggled state
    });
  }
  
  componentDidMount() {
    const { initialized } = this.props;
    this.startWebcam();  // Start webcam on component mount
    if (!initialized) {
      setTimeout(() => {
        const button = document.querySelector('#ControlCenter button.passiveButton'); // Select the button
        if (button) {
          button.click(); // Programmatically trigger the button click
        }
      }, 2500); // 2.5-second delay
    }
  }
  render() {
 
    const { startTime, endTime, currentTime, chapterId, savedPhotos, initialized, setSavedPhotos,setChapterId  } = this.props;  // Access savedPhotos and setSavedPhotos from props
    const { isToggled } = this.state;
    return (
      <>
        {!initialized && (
          // Button that must be clicked to show ControlCenter
          <div id="ControlCenter" className="hidden launcher" style={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <div>
              <button className='passiveButton'
                onClick={() => {
                  this.swishAudio.currentTime = 0;
                  this.swishAudio.play();
                  this.initialLaunch(); // Correctly call the function here
                }}
              >
                loading video and microscope...
              </button>
            </div>
          </div>
        )}

     {initialized && (
      <div id="ControlCenter" className="normal">
            {/* Display the current video time */}
            <div id="Timer-Board">
            ⏱ {this.state.timer ? this.formatTime(this.state.timer) : ""}
            </div>

        <div id="VideoCenter" className={isToggled ? 'toggled' : 'normal'}>
          <ReactPlayer
            ref={(p) => {
              this.p = p;
            }}
            url="https://vimeo.com/1043489560"
            className="react-player"
            playing={this.state.playing}
            id="vimeoVideo"
            style={{
              position: 'relative',
              zIndex: this.state.isToggled ? 1500 : 1000,        // Toggle z-index to match the container
            }}
            controls={false}  // Disable default controls
            onProgress={this.handleProgress}  // Track progress to stop at endTime
          />
        </div>
        
        <div id="WebcamCenter" className={isToggled ? 'toggled' : 'normal'}>
          <div>
            <video id="webcam" ref={this.webcamRef} autoPlay playsInline className={isToggled ? 'toggled' : 'normal'}></video>
            <canvas ref={this.canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ display: 'none' }}></canvas>
          </div>
        </div>
        

      {/* Button Container */}
        <div id="primaryButtonsContainer"  >

              {/* Button 1 - Capture Image */}
              {chapterId < 12 && (
                <button className='primaryButton'
                  onClick={() => {
                    this.cameraShutterAudio.currentTime = 0;
                    this.cameraShutterAudio.play();  // Play camera shutter sound
                    captureImage(this.webcamRef, this.canvasRef, CANVAS_WIDTH, CANVAS_HEIGHT, chapterId, savedPhotos, setSavedPhotos);
                    if (chapterId !== null) {
                      setChapterId(chapterId + 1); // Update chapterId to navigate to the next chapter
                    }
                  }}
                >
                  Save My Work
                </button>
              )}

              {/* Toggle View Button */}
              <button className='primaryButton' onClick={this.toggleView}>
                {isToggled ? '2x Video' : '2x Microscope'}
              </button>

              {/* PlayPause */}
              {this.state.showPlayPauseButton && (
                <button className='primaryButton' id="playPauseButton" onClick={this.playPause}>
                  {this.state.playing ? 'Pause' : 'Play'}
                </button>
              )}
        </div>
      </div>
      
      )}
      </>
    );
  }
}

export default VideoCameraControl;
