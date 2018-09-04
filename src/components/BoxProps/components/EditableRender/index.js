import React from 'react';
import { compose, withHandlers, withState, renderComponent, branch, renderNothing } from 'recompose';
import EditableText from 'components/EditableText';
import { Flex, Box } from 'reflexbox';
import styles from '../../styles.scss';
import classnames from 'classnames';
import Column from '../Column';
import Row from '../Row';

export const EditableRender = compose(
  withHandlers({
    onSave: ({ prop, boxIt }) => (value) => {
      boxIt.set(prop, value).save();
    }
  }),
)(({ prop, value, onSave }) => {
  return (
    <Row key={prop} >
      <Column w={0.4} >{prop}</Column>
      <Column w={0.6} >
        <EditableText value={value} onSave={onSave}/>
      </Column>
    </Row>    
  )
});

export default EditableRender;
