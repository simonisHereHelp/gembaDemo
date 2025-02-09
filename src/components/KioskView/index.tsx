import React from 'react';
import styles from './styles.module.css';
import Spacer from '@site/src/components/Spacer';
import isHereKV from '@site/static/img/isHereKV.png'

const StraightforwardView: React.FC = () => {
  return (
    <div className={styles.Container} >
      <div className={styles.Content} >
        <div className={styles.HeaderContainer} data-aos="flip-left" data-aos-duration="1000">
          <Spacer height={20} />
          <p className={styles.Description}>            
          </p>
          <img src={isHereKV} alt="isHereKV Workflow" className={styles.KioskImage} />
        </div>
      </div>
    </div>
  );
};

export default StraightforwardView;
