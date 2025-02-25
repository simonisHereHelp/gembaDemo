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
        Where the production floor <span className={styles.SeparatorText}>comes alive</span>.
        </h1>
        <Spacer height={50} />
        <TypeAnimation
          className={styles.HeaderTyper}
          sequence={[
            "Live insights direct from the frontline.", 2500,
            "Experience real-time production data.", 2500,
            "Empower continuous improvement.", 2500,
          ]}
          repeat={Infinity}
        />
        <Spacer height={50} />
      </div>
    </div>
  );
};

export default HeaderView;
