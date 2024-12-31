import React, { useEffect, useRef, useContext } from 'react';
import { useHistory,useLocation  } from 'react-router-dom';
import { GlobalPhotoContext } from '../theme/Root';
import loginIcon from '@site/static/img/log-in.png'
import logoutIcon from '@site/static/img/log-out.png'
import swishSound from '@site/static/img/swoosh.mp3'


const BottomNav = () => {
  const history = useHistory();

  const handleIconClick = () => {
      history.push('/face');
  };

  return (
    <div className="bottom-nav-menu">

      <div
        className="bottom-nav-item"
        onClick={handleIconClick}
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      >
        <img
          src={logoutIcon}
          className="nav-icon"  />
        <strong>Log Out User</strong>
      </div>
    </div>
  );
};

export default BottomNav;
