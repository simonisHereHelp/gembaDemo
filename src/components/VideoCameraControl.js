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
      initialized: this.props.initialized,  // Indicates if the first interaction has happened
      isToggled: this.props.isToggled,  // Control the toggle between sizes
      showPlayPauseButton: true,  // Control the visibility of the play/pause button
    };
    this.playUntil = this.playUntil.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.initializePlay = this.initializePlay.bind(this);
    this.toggleView = this.toggleView.bind(this); // Bind toggleView here
    this.openControlCenter = this.openControlCenter.bind(this); // Bind openControlCenter here
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

  openControlCenter() {
    this.setState(
      { 
        initialized: true      // Mark as initialized
      },
      () => {
        this.props.setInitialized(true);  // Update global initialized state
        this.startWebcam(); 
      }
    );
  }

  playUntil(startTime, endTime) {
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
  // First interaction to initialize the video with sound
  initializePlay() {
    const { startTime, endTime, chapterId } = this.props;  // Get startTime, endTime, and chapterId from props
    if (startTime !== undefined && endTime !== undefined && chapterId !== undefined) {
      this.setState({ 
        playing: true,  // Start video playback
        initialized: true,  // Mark the player as initialized locally
      }, () => {
        this.props.setInitialized(true);  // Update global initialized state
        this.playUntil(parseFloat(startTime), parseFloat(endTime));  // Start video
      });
    } else {
      console.error("startTime, endTime, or chapterId is missing in the props");
    }
  }
  
  // Automatically play the next segment when the component updates (no user interaction needed)
  componentDidUpdate(prevProps) {
    const { startTime, endTime, chapterId } = this.props;
  
    if (this.state.initialized &&
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
    const currentTime = state.playedSeconds; // Get the current video time
    this.setState({ currentTime });
    if (this.props.setCurrentTime) {
      this.props.setCurrentTime(currentTime);
    };
    if (this.props.endTime && state.playedSeconds >= this.props.endTime) {
      this.setState({ playing: false,
        showPlayPauseButton: false,  // Hide the play/pause button when video stops
       });
      console.log(`Video stopped at ${this.props.endTime} seconds`);
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
    this.startWebcam();  // Start webcam on component mount
  }
  render() {
 
    const { startTime, endTime, chapterId, savedPhotos, setSavedPhotos,setChapterId  } = this.props;  // Access savedPhotos and setSavedPhotos from props
    const { isToggled } = this.state;
    return (
      <>
        {!this.state.initialized && (
          // Button that must be clicked to show ControlCenter
          <div id="ControlCenter" className="hidden launcher" style={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <div>
              <button
                onClick={() => {
                  this.swishAudio.currentTime = 0;
                  this.swishAudio.play();
                  this.openControlCenter(); // Correctly call the function here
                }}
                style={{ padding: '15px 30px', fontSize: '20px', color: 'white', backgroundColor: 'orange', cursor: 'pointer' }}
              >
                load video and microscope...
              </button>
            </div>
          </div>
        )}

     {this.state.initialized && (
      <div id="ControlCenter" className="normal">
            {/* Display the current video time */}
            <div id="Timer-Board">
              ⏱ {this.formatTime(this.state.currentTime)} {/* Time is displayed in mm:ss format */}
            </div>

        <div id="VideoCenter" className={isToggled ? 'toggled' : 'normal'}>
          <ReactPlayer
            ref={(p) => {
              this.p = p;
            }}
            url="https://vimeo.com/1035029082"
            className="react-player"
            playing={this.state.playing}
            width="100%"
            height="100%"
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
        <div id="ButtonsContainer"  >

              {/* Button 1 - Capture Image */}
              {chapterId < 12 && (
                <button 
                  onClick={() => {
                    this.cameraShutterAudio.currentTime = 0;
                    this.cameraShutterAudio.play();  // Play camera shutter sound
                    captureImage(this.webcamRef, this.canvasRef, CANVAS_WIDTH, CANVAS_HEIGHT, chapterId, savedPhotos, setSavedPhotos);
                    if (chapterId !== null) {
                      setChapterId(chapterId + 1); // Update chapterId to navigate to the next chapter
                      console.log(`Navigating to chapter ${chapterId + 1}`);
                    }
                  }}
                >
                  Save My Work
                </button>
              )}

              {/* Toggle View Button */}
              <button onClick={this.toggleView}>
                {isToggled ? '2x Video' : '2x Microscope'}
              </button>

              {/* PlayPause */}
              {this.state.showPlayPauseButton && (
                <button id="playPauseButton" onClick={this.playPause}>
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
