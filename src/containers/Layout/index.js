import React from 'react';
import styles from './styles.css';
import classnames from 'classnames';

console.log('stylesstyles', styles);
export const Layout = () => {
  return (
    <div className={classnames(styles.container)}>
      Layout
    </div>
  )
}

export default Layout;