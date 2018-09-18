import React from 'react';
import { Box } from 'reflexbox';
import styles from '../../styles.scss';
import classnames from 'classnames';

export const Column = (props) => <Box {...props} className={classnames(styles.col, props.className)} />;

export default Column;
