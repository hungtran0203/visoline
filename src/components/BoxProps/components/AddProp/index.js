import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import { compose, withHandlers, withState, renderComponent, branch, renderNothing } from 'recompose';
import { withStreams, withStreamProps, omitProps, composeHandler } from 'libs/hoc';
import { withItemWatcher, withItemImOrNothing, withItemItOrNothing, withItemIt } from 'libs/hoc/builder';
import { withRootItem, withRootItem$, withActiveItem } from 'libs/hoc/builder/item';

import * as itemBuilderEnhancers from 'libs/hoc/builder/item';
import * as layoutHandlers from 'containers/Layout/handlers';
import { withModelStream } from 'libs/model/hoc';
import Icon from '@material-ui/core/Icon';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Flex, Box } from 'reflexbox';
import { Set } from 'immutable';
import withProps from 'recompose/withProps';
import EditableText from 'components/EditableText';
import withPropsOnChange from 'recompose/withPropsOnChange';
import BoxModel from 'libs/editor/model/box';

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
    completeEdit: ({ prop$, value$, adding$, modelIt }) => () => {
      if (prop$.get() && value$.get()) {
        modelIt.set(prop$.get(), value$.get()).save();
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