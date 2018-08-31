import React from 'react';
import classnames from 'classnames';
import styles from '../../styles.scss';
import { Flex } from 'reflexbox';

export const Header = ({ children }) => (
  <Flex justify="space-between" className={classnames(styles.row, styles.header)}>
    {children}
  </Flex>
);

export default Header;
