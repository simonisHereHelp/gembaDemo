import React from 'react';
import styles from './styles.module.css';
import Spacer from '@site/src/components/Spacer';

const StraightforwardView: React.FC = () => {
  return (
    <div className={styles.Container} >
      <div className={styles.Content} >
        <div className={styles.HeaderContainer} data-aos="flip-left" data-aos-duration="1000">
          <h3 className={styles.Tagline}>Key Elements in Action</h3>
          <h1 className={styles.Title}>
            Training Video, <br /> Practice Photos <br /> and Kiosk APP
          </h1>
          <Spacer height={20} />
          <p className={styles.Description}>
            
          </p>
        </div>
      </div>
    </div>
  );
};

export default StraightforwardView;
