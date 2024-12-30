import React, { useEffect, useRef, useContext } from 'react';
import { useHistory,useLocation  } from 'react-router-dom';
import { GlobalPhotoContext } from '../theme/Root';
import loginIcon from '@site/static/img/log-in.png'
import logoutIcon from '@site/static/img/log-out.png'
import swishSound from '@site/static/img/swoosh.mp3'


const BottomNavMenu = () => {
  const { loginName, setLoginName, loginReturnLoc, setLoginReturnLoc } = useContext(GlobalPhotoContext);
  const history = useHistory();
  const swishAudio = useRef(new Audio(swishSound));

  useEffect(() => {
    // Trigger animation and sound on mount
    triggerMenuAnimation(false);
  }, []);
  const triggerMenuAnimation = (playSound = false) => {
    const menu = document.querySelector(".bottom-nav-menu");
    if (menu) {
      if (playSound && swishAudio.current) {
        swishAudio.current.currentTime = 0;
        swishAudio.current.play();
      }
      menu.classList.add("flip");
      setTimeout(() => {
        menu.classList.remove("flip");
      }, 500); // Match the animation duration
    }
  };


  const handleIconClick = () => {
    setLoginReturnLoc(location.pathname);
    triggerMenuAnimation(true);
    if (loginName) {
      // Logout logic
      history.push('/log-out-user');
      setLoginName(null);
    } else {
      // Navigate to FaceDetection for login
      history.push('/face');
    }
  };

  return (
    <div className="bottom-nav-menu">
        {loginName ? `User: ${loginName}` : "No User Logged In"}
        <hr style={{ width: '90%', margin: '10px auto', border: 'none', borderTop: '1px solid #ddd' }} />
      <div
        className="bottom-nav-item"
        onClick={handleIconClick}
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      >
        <img
          src={loginName ? logoutIcon : loginIcon}
          alt={loginName ? "Log Out" : "Log In"}
          className="nav-icon"
        />
        <strong>{loginName ? "Log Out User" : "Log In User"}</strong>
      </div>
    </div>
  );
};

export default BottomNavMenu;
