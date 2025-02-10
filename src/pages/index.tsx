import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import '../../static/img/isHereKV_small.png';
import '../../static/img/3steps.png';
import HomepageHeader from '@site/src/components/HomepageHeader';

import KioskView from '@site/src/components/KioskView';
import AOS from 'aos';
import 'aos/dist/aos.css';
import clsx from 'clsx';
import Spacer from '@site/src/components/Spacer';


const Index = () => {

  // useEffect(() => {
  //   if (!document.body.classList.contains('show-navbar')) {
  //     document.querySelector('.navbar').style.display = 'none';
  //   }
  // }, []);

  return (
    <Layout
      title="Gemba Live"
      description="Native OS Build & Monitoring Radiator">
      <HomepageHeader/>
      <main>
      <Spacer height={30} />
      </main>
    </Layout>
  );
};

export default Index;
