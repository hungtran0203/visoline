import React from 'react';
import styles from './styles.scss';
import classnames from 'classnames';
import _ from 'lodash';
import { compose, withHandlers, withState, renderComponent, branch, renderNothing } from 'recompose';
import { withStreams, withStreamProps, omitProps, composeHandler } from 'libs/hoc';
import { withItemWatcher, withItemImOrNothing, withItemItOrNothing, withItemIt } from 'libs/hoc/builder';
import { withRootItem, withRootItem$, withActiveItem } from 'libs/hoc/builder/item';

import * as itemBuilderEnhancers from 'libs/hoc/builder/item';
import * as layoutHandlers from 'containers/Layout/handlers';
import { withModel, withModelStream, withModelStreamProp } from 'libs/model/hoc';
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
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';

import ReadOnlyRender from './components/ReadOnlyRender';
import HiddenRender from './components/HiddenRender';
import EditableRender from './components/EditableRender';
import EnhancerRender from './components/EnhancerRender';

const ConfigSchema = {
  type: { type: 'editable' },
  name: { type: 'editable' },
  content: { type: 'editable' },
  className: { type: 'editable' },
  enhancers: { type: 'enhancer' },
  style: { type: 'editable' },
  directoryId: { type: 'hidden' },
  children: { type: 'hidden' },
  parentId: { type: 'hidden' },
  id: { type: 'hidden' },
};

const TypeMap = {
  readonly: ReadOnlyRender,
  hidden: HiddenRender,
  editable: EditableRender,
  enhancer: EnhancerRender,
}

const getPropType = (prop) => {
  return _.get(ConfigSchema, `${prop}.type`, 'hidden');
}

const getConfigProps = () => {
  return Object.keys(ConfigSchema);
}

const AddProp = compose(
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
    completeEdit: ({ prop$, value$, adding$, boxIt }) => () => {
      if (prop$.get() && value$.get()) {
        boxIt.set(prop$.get(), value$.get()).save();
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

export const BoxProps = compose(
  withModelStreamProp({ srcStream: ACTIVE_ITEM_STREAM, model: BoxModel, dstProp: 'activeBoxIt', watching: true }),
  branch(({ activeBoxIt }) => !activeBoxIt, renderNothing),
)(({ activeBoxIt }) => (
  <div className={styles.wrapper}>
    {
      getConfigProps().map(prop => {
        const Renderer = _.get(TypeMap, getPropType(prop), TypeMap.hidden);
        const value = activeBoxIt.get(prop);
        return (
          <Renderer key={prop} prop={prop} value={value} boxIt={activeBoxIt} />
        )
      })
    }
    <AddProp boxIt={activeBoxIt} />
  </div>
));

export default BoxProps;
