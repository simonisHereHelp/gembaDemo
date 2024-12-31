import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalPhotoContext } from '../theme/Root';
import Layout from "@theme/Layout";
import logOutIcon from '@site/static/img/log-out.png'


const TransitionPage = () => {
  const { loginName, setLoginName, loginReturnLoc } = useContext(GlobalPhotoContext);
  const history = useHistory();

  useEffect(() => {
    // Redirect after a brief delay (e.g., 1.5 seconds)
    setLoginName(null)
    const timer = setTimeout(() => {
      if (loginReturnLoc) {
        history.push(loginReturnLoc);
      } else {
        history.push('/');
      }
    }, 2500);

    return () => clearTimeout(timer); // Cleanup the timeout
  }, [loginName, loginReturnLoc]);

  return (
    <Layout title="Log Out" description="via FaceCam for seamless log-in">
          <section className="faceCam-view">
          <img
          src={logOutIcon}
          alt="Log Out Icon"
          style={{
            display: 'block',
            margin: '10px auto',
            width: '80px',
            height: '80px',
          }}
          />
            <h2>log out user...</h2>
            <p>Please wait while we log you out and redirect you.</p>
          </section>
    </Layout>
  );

};

export default TransitionPage;
