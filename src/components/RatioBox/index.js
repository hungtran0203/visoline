import React from 'react';
import styles from './styles.scss';

const matching = (str, patterns) => {
  let res;
  patterns.findIndex(({ pattern, format }) => {
    res = str.match(pattern);
    if (res) {
      if (typeof format === 'function') {
        res = format(res);
      }
      return true;
    }
  });
  return res;
};

const evalRatio = (ratio = 1) => {
  let val = ratio;
  if(typeof val === 'string') {
    val = matching(val, [
      { 
        pattern: /^(\d+)$/,
        format: (res) => parseInt(res[0]),
      },
      { 
        pattern: /^(\d+):(\d+)$/,
        format: (res) => (parseInt(res[2]) / (parseInt(res[1]) || 1)),
      },
      { 
        pattern: /^(\d+)\.(\d+)$/,
        format: (res) => parseFloat(res[0]),
      },
    ]);
  }

  // percentage
  if(val <= 1) {
    val = val * 100;
  }
  return val;
};

export const RatioBox = ({ children, ratio }) => (
  <div className={styles.square}>
    <div className={styles.content}>
      {children}
    </div>
    <div className={styles.indicator} style={{ paddingBottom: `${evalRatio(ratio)}%`}}>
    </div>
  </div>
);

export default RatioBox;
