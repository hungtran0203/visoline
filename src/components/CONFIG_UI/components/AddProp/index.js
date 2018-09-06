import React from 'react';
import { compose, withHandlers, renderComponent, branch } from 'recompose';
import { withStreams, withStreamProps, composeHandler } from 'libs/hoc';

import Icon from '@material-ui/core/Icon';
import { Flex, Box } from 'reflexbox';
import EditableText from 'components/EditableText';

export const AddProp = compose(
  withStreamProps({ 
    adding: 'prop.adding',
    prop: 'prop.prop',
    value: 'prop.value',
  }),
  withStreams({
    adding$: 'prop.adding',
    prop$: 'prop.prop',
    value$: 'prop.value',
  }),
  withHandlers({
    onClick: ({ adding$ }) => () => {
      adding$.set(true);
    },
    completeEdit: ({ prop$, value$, adding$, model }) => () => {
      if (prop$.get() && value$.get()) {
        model.set(prop$.get(), value$.get()).save();
        adding$.set(false);
        prop$.set('');
        value$.set('')
      }
    },
  }),
  composeHandler({
    handlerName: 'onSaveProp',
    handlerFn: ({ adding$, prop$ }) => (val) => {
      prop$.set(val)
    }
  }),
  composeHandler({
    handlerName: 'onSaveProp',
    handlerFn: ({ completeEdit }) => () => completeEdit(),
  }),
  composeHandler({
    handlerName: 'onSaveValue',
    handlerFn: ({ adding$, value$ }) => (val) => {
      value$.set(val)
    }
  }),
  composeHandler({
    handlerName: 'onSaveValue',
    handlerFn: ({ completeEdit }) => () => completeEdit(),
  }),
  branch(
    ({ adding }) => !adding,
    renderComponent(({ onClick }) => {
      return (
        <div onClick={onClick}>
          <Icon>add</Icon>
        </div>
      )
    })
  ),
)(({ prop, value, onSaveProp, onSaveValue }) => {
  return (
    <Flex key={prop}>
      <Box w={0.4}>
        <EditableText value={prop || 'Prop'} onSave={onSaveProp}/>
      </Box>
      <Box w={0.6}>
        <EditableText value={value || 'Value'} onSave={onSaveValue}/>
      </Box>
    </Flex>    
  )  
});

export default AddProp;