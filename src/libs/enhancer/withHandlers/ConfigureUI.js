import React from 'react';
import { Flex, Box } from 'reflexbox';
import _ from 'lodash';
import Icon from '@material-ui/core/Icon';
import { compose, withHandlers, branch, renderNothing, withState, withProps } from 'recompose';
import { withStreamProps, withStreams } from 'libs/hoc';
import EditableText from 'components/EditableText';
import { withEnhancerIt } from 'libs/hoc/builder/enhancer';
import { withItemWatcher } from 'libs/hoc/builder';
import { fromJS } from 'immutable';

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
    addingPropState$: [ADDING_PROP_STATE_STREAM, { init: false }],
  }),
  branch(({ addingPropState }) => !addingPropState, renderNothing),
  withEnhancerIt(),
  withHandlers({
    saveRow: ({ propName$, propSelector$, enhIt, addingPropState$ }) => () => {
      const propName = propName$.get();
      const propSelector = propSelector$.get();
      if (propName && propSelector) {
        enhIt.setIn(['options', 'props', propName], propSelector).save();
        addingPropState$.set(false);
        propName$.set('');
        propSelector$.set('');
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

export const ConfigureUI = compose(
  withProps(({ enh }) => ({ enhIm: enh.toIm() })),
  withItemWatcher('enhIm', 'enhancer'),
)(
  ({ enhIm }) => {
    return (
      <div>
        <ToolBar />
        {
          enhIm.getIn(['options', 'props'], fromJS({})).toSeq().map((propVal, propName) => {
            return (
              <Flex key={propName} justify="space-between">
                <div>{propName}</div>
                <div>{propVal}</div>
              </Flex>
            )
          }).toList().toJSON()
        }
        <NewPropRow enh={enhIm} />
      </div>
    )
  }
);