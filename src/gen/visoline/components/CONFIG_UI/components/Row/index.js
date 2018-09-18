import React from 'react';
import { Flex } from 'reflexbox';
import styles from '../../styles.scss';
import classnames from 'classnames';

export const Row = (props) => <Flex {...props} className={classnames(styles.row, props.className)} />;

export default Row;
