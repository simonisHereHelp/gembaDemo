import React, { useState } from 'react'; 
import Spacer from '@site/src/components/Spacer';
import styles from './styles.module.css';
import { TypeAnimation } from "react-type-animation";
const HeaderView: React.FC = () => {

  return (
    <div
      className={styles.Container}
      style={{ height: 250 }}>
      <div style={{ position: "relative", textAlign: "left", width: "max-content" }}>
        <h1 className={styles.HeaderTitle}>
        expert-led training in <span className={styles.SeparatorText}>restricted-access</span> production environments.
        </h1>
        <Spacer height={50} />
        <TypeAnimation
          className={styles.HeaderTyper}
          sequence={[
            "Security: No on-site access required.", 2500,
            "Training: Delivered by our experts.", 2500,
            "Assessment: Securely logged with verifiable tokens.", 2500, 
          ]}
          repeat={Infinity}
        />
        <Spacer height={50} />
      </div>
    </div>
  );
};

export default HeaderView;
