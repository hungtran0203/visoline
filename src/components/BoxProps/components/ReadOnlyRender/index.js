import React from 'react';
import { Flex, Box } from 'reflexbox';
import styles from '../../styles.scss';
import classnames from 'classnames';
import Column from '../Column';
import Row from '../Row';

export const ReadOnlyRender = ({ prop, value }) => {
  return (
    <Row key={prop} >
      <Column w={0.4} >{prop}</Column>
      <Column w={0.6} >{value}</Column>
    </Row>    
  )
};

export default ReadOnlyRender;
