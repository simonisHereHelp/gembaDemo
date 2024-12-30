import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalPhotoContext } from '../theme/Root';
import loginIcon from '@site/static/img/log-in.png'
import logoutIcon from '@site/static/img/log-out.png'

const BottomNavMenu = () => {
  const { loginName, setLoginName } = useContext(GlobalPhotoContext);
  const history = useHistory();

  const handleIconClick = () => {
    if (loginName) {
      // Logout logic
      setLoginName(null);
      alert("Logged out successfully.");
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
