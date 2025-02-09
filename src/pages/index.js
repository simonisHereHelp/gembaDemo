import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '@theme/Layout';
import '../../static/img/isHereKV_small.png';
import '../../static/img/3steps.png';

const Index = () => {
  const history = useHistory();

  useEffect(() => {
    if (!document.body.classList.contains('show-navbar')) {
      document.querySelector('.navbar').style.display = 'none';
    }
  }, []);

  return (
    <Layout title="Live, On-Site Training & Certification" description="Bringing star trainers to your restricted-access production environment—without the hassle of security clearances.">
      <div>
        <h1>Bring Expert Trainers to Your Restricted-Access Production Environment</h1>
        <p>Skip the hassle of securing security clearances.</p>
        <p>Many high-value production facilities operate in restricted-access environments with tight security controls, preventing independent experts—including expertise trainers—from entering.</p>
        <p>Our service removes these barriers by delivering expert instruction remotely, providing live, hands-on training and certification without the need for security clearances. With real-time guidance, your team gains direct access to specialized expertise, ensuring precision, compliance, and operational excellence—right where the work happens.</p>

        <h2>🚀 Get Started</h2>
=        <a className="primaryButton" href="/golive_room1">Get Started room 1</a>      
        </div>
    </Layout>
  );
};

export default Index;
