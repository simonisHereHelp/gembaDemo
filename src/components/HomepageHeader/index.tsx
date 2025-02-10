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
          Transform <span className={styles.SeparatorText}>Training</span>
        </h1>
        <Spacer height={10} />
        <TypeAnimation
          className={styles.HeaderTyper}
          sequence={[
            "from in-person,", 2500,
            "to automatic.", 2500,
            "", 500, 
            "from sheets/files,", 2500,
            "to secured 'tokens'.", 2500,
            "", 500, 
            "from pass/fail,", 2500,
            "to badges earned.", 2500,
            "", 500, 
          ]}
          repeat={Infinity}
        />
        <Spacer height={50} />
        <p className={styles.DescriptionText}>Discover our On-Site Certification Program.</p>
        <Spacer height={10} />
      </div>
    </div>
  );
};

export default HeaderView;
