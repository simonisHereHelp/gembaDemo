import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import ShareTab from '@site/src/components/ShareTab';
import KioskView from '@site/src/components/KioskView';
import Spacer from '../components/Spacer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import StraightforwardView from '@site/src/components/StraightforwardView';


export default function Home(): JSX.Element {


  useEffect(() => {
    AOS.init();
    AOS.refresh();
  });
  return (
    <Layout
      title="is Here"
      description="Trainning Gembaly">
      <ShareTab />
      <main>
      <Spacer height={20} />
      <KioskView />
      <Spacer height={70} />
        <StraightforwardView />
        <Spacer height={70} />
        <Spacer height={20} />
      </main>
    </Layout>
  );
}
