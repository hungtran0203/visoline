import Registry from 'libs/Registry';
import React from 'react';
import { compose, withHandlers, withState, renderComponent, branch, renderNothing, withProps } from 'recompose';
import EditableText from 'components/EditableText';
import { Flex, Box } from 'reflexbox';
import styles from '../../styles.scss';
import classnames from 'classnames';
import Column from '../Column';
import Row from '../Row';
import { withStreams, withStreamProps } from 'libs/hoc';


export const ReferenceRender = compose(
  withStreams({ activeNode$: 'activeNode.stream' }),
  withHandlers({
    onSave: ({ prop, model, activeNode$ }) => () => {
      const value = activeNode$.get();
      if (value) {
        const lookup = Registry.lookup(value);
        model.set(prop, value).save();
      }
    }
  }),
  withProps(({ value }) => {
    const MetaModel = Registry('MODEL_CLASS').get('meta');
    const handlerIt = MetaModel.getInstance(value);
    if (handlerIt) {
      return { displayName: handlerIt.get('name') }
    }
  }),
)(({ prop, displayName, onSave }) => {
  return (
    <Row key={prop} >
      <Column w={0.4} >{prop}</Column>
      <Column w={0.6} >
        <Flex justify="space-between">
          <div>{displayName}</div>
          <div onClick={onSave}>Set</div>
        </Flex>
      </Column>
    </Row>    
  )
});

export default ReferenceRender;