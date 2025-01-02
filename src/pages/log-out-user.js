import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalPhotoContext } from '../theme/Root';
import Layout from "@theme/Layout";
import logOutIcon from '@site/static/img/log-out.png';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const LogoutPage = () => {
  const { loginName, setLoginName, loginReturnLoc, setSavedPhotos } = useContext(GlobalPhotoContext);
  const history = useHistory();
  const markdownTable = `
  | Field       | Value                |
  |------------------|------------------------------|
  | Name        | ${loginName || "N/A"} |
  | Onboard Date|         |
  | Title       |             |
  | Department  |        |
  | Contact     |         |
  `;

  useEffect(() => {
    // Hide the bottom nav menu
    const bottomNav = document.querySelector('.bottom-nav-menu');
    if (bottomNav) {
      bottomNav.style.display = 'none';
    }

    // Clear user data
    setLoginName(null);
    setSavedPhotos(Array(12).fill(null));

    // Redirect after 2.5 seconds
    const timer = setTimeout(() => {
      const button = document.querySelector('.passiveButton'); // Select the button
      if (button) {
        button.click();
      }
    }, 2500);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [setLoginName, setSavedPhotos]);

  const handleButtonClick = () => {
    const bottomNav = document.querySelector('.bottom-nav-menu');
    if (bottomNav) {
      bottomNav.style.display = 'flex';
    }
    if (loginReturnLoc) {
      history.push(loginReturnLoc);
    } else {
      history.push("/");
    }
  };

  return (
    <Layout title="Log Out" description="via FaceCam for seamless log-in">
      <section className="faceCam-view">
        <h3>Logging out user...</h3>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownTable}</ReactMarkdown>
        <button
          className="passiveButton"
          onClick={handleButtonClick}
        >
          Please wait while we log you out and redirect you.
        </button>
      </section>
    </Layout>
  );
};

export default LogoutPage;
