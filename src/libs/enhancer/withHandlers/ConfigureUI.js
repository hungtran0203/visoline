import React from 'react';
import { Flex, Box } from 'reflexbox';
import _ from 'lodash';
import Icon from '@material-ui/core/Icon';
import { compose, withHandlers, branch, renderNothing, withState } from 'recompose';
import { withStreamProps, withStreams } from 'libs/hoc';
import EditableText from 'components/EditableText';

const ADDING_PROP_STATE_STREAM = 'enhancer.config.state.addingProp';
const EDDITING_PROPNAME_VALUE_STREAM = 'enhancer.config.value.editing.propName';
const EDDITING_PROPSELECTOR_VALUE_STREAM = 'enhancer.config.value.editing.propSelector';

const NewPropRow = compose(
  withStreamProps({
    addingPropState: [ADDING_PROP_STATE_STREAM, { init: false }],
    propName: [EDDITING_PROPNAME_VALUE_STREAM, { init: '' }],
    propSelector: [EDDITING_PROPSELECTOR_VALUE_STREAM, { init: '' }],    
  }),
  withStreams({
    propName$: [EDDITING_PROPNAME_VALUE_STREAM, { init: '' }],
    propSelector$: [EDDITING_PROPSELECTOR_VALUE_STREAM, { init: '' }],
  }),
  branch(({ addingPropState }) => !addingPropState, renderNothing),
  withHandlers({
    saveRow: ({ propName$, propSelector$, enh }) => () => {
      const propName = propName$.get();
      const propSelector = propSelector$.get();
      if (propName && propSelector) {
        console.log(propName, propSelector);
        enh.addHandler(propName, propSelector);
      }
    }
  }),
  withHandlers({
    onSavePropName: ({ propName$, saveRow }) => (value) => {
      propName$.set(value);
      saveRow();
    },
    onSavePropSelector: ({ propSelector$, saveRow }) => (value) => {
      propSelector$.set(value);
      saveRow();
    },
  })
)(({ propName, propSelector, onSavePropName, onSavePropSelector }) => {
  return (
    <Flex justify="space-between">
      <div>
        <EditableText value={propName || 'Name'} onSave={onSavePropName} placeholder={'handler'}/>
      </div>
      <div>
        <EditableText value={propSelector || 'PropSelector'} onSave={onSavePropSelector} placeholder={'propSelector'}/>
      </div>
    </Flex>
  )
});

const ToolBarAddBtn = compose(
  withStreams({
    addingPropState$: [ADDING_PROP_STATE_STREAM, { init: false }],
  }),
  withHandlers({
    onClick: ({ addingPropState$ }) => () => {
      addingPropState$.set(true);
    }
  })
)((props) => {
  const handlers = _.pick(props, ['onClick']);
  return (
    <Icon {...handlers} >add</Icon>
  )
});

const ToolBarRemoveBtn = compose(
  withStreams({
    addingPropState$: [ADDING_PROP_STATE_STREAM, { init: false }],
  }),
  withHandlers({
    onClick: ({ addingPropState$ }) => () => {
      addingPropState$.set(true);
    }
  })
)((props) => {
  const handlers = _.pick(props, ['onClick']);
  return (
    <Icon {...handlers} >remove</Icon>
  )
});

const ToolBar = () => (
  <Flex>
    <ToolBarAddBtn />
    <ToolBarRemoveBtn />
  </Flex>
);

export const ConfigureUI = ({ enh }) => {
  const opts = enh.getOptions('raw');
  console.log('opts', opts, enh.toIm());
  const props = _.get(opts, 'props');
  const options = {};
  return (
    <div>
      <ToolBar />
      {
        Object.keys(props).map(propName => {
          return (
            <Flex key={propName} justify="space-between">
              <div>{propName}</div>
              <div>{props[propName]}</div>
            </Flex>
          )
        })
      }
      <NewPropRow enh={enh} />
    </div>
  )
}