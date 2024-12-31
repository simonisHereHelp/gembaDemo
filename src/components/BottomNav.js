import React, { useContext, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { GlobalPhotoContext } from '../theme/Root';
import loginIcon from '@site/static/img/log-in.png';
import logoutIcon from '@site/static/img/log-out.png';
import swishSound from '@site/static/img/swoosh.mp3';

const BottomNav = () => {
  const { loginName, setLoginName, setLoginReturnLoc } = useContext(GlobalPhotoContext);
  const history = useHistory();
  const location = useLocation();
  const swishAudio = useRef(new Audio(swishSound));
  const [isFlipping, setIsFlipping] = React.useState(false); // State for animation

  const handleIconClick = () => {
    // Trigger the flip animation and play sound
    setIsFlipping(true);
    if (swishAudio.current) {
      swishAudio.current.currentTime = 0; // Reset sound
      swishAudio.current.play(); // Play sound
    }

    setTimeout(() => {
      setIsFlipping(false); // Reset animation after duration

      if (loginName) {
        // Logout logic
        setLoginName(null);
        history.push('/log-out-user');
      } else {
        // Navigate to FaceDetection for login
        setLoginReturnLoc(location.pathname);
        history.push('/face');
      }
    }, 500); // Match the CSS animation duration (500ms)
  };

  return (
    <div className={`bottom-nav-menu ${isFlipping ? 'flip' : ''}`}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <strong>{loginName ? `User: ${loginName}` : 'No User Logged In'}</strong>
      </div>
      <div
        className="bottom-nav-item"
        onClick={handleIconClick}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <img
          src={loginName ? logoutIcon : loginIcon}
          alt={loginName ? 'Log Out' : 'Log In'}
          className="nav-icon"
        />
        <strong style={{ marginLeft: '10px' }}>{loginName ? 'Log Out User' : 'Log In User'}</strong>
      </div>
    </div>
  );
};

export default BottomNav;
