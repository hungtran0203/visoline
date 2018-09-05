import React from 'react';
import { compose, withHandlers, withState, renderComponent, branch, renderNothing, withProps } from 'recompose';
import EditableText from 'components/EditableText';
import { Flex, Box } from 'reflexbox';
import Icon from '@material-ui/core/Icon';
import { withStreams, withStreamProps, omitProps, composeHandler } from 'libs/hoc';
import MetaModel from 'libs/loader/meta';
import AddProp from '../AddProp'
import EditableRender from '../EditableRender'

const EnhancerOptionList = compose(
  withStreamProps({
    active: 'render.boxenahcer.active',
  }),
  branch(
    ({ active, boxEnhIt }) => active !== boxEnhIt.getId(),
    renderNothing,
  ),
)(
  ({ boxEnhIt }) => {
    return (
      <Flex column>
        {
          boxEnhIt.toIm().map((value, prop) => {
            return (
              <EditableRender boxIt={boxEnhIt} key={prop} prop={prop} value={value} />
            )
          }).toArray()
        }
        <AddProp modelIt={boxEnhIt} />
      </Flex>
    );
  }
);

const BoxEnhancerRender = compose(
  withStreams({ selectedEnh$: 'activeNode.stream' }),
  withStreams({ active$: 'render.boxenahcer.active' }),
  withHandlers({
    onClick: ({ active$, boxEnhIt }) => () => {
      active$.set(boxEnhIt.getId())
    },
    onSelect: ({ selectedEnh$, boxEnhIt }) => () => {
      const enhIt = MetaModel.getInstance(selectedEnh$.get());
      if (enhIt.get('type') === 'enhancer') {
        enhIt.get('type')
      }
      boxEnhIt.enhancer.changeTo(enhIt);
    },
  }),
  withProps(({ boxEnhIt }) => ({
    enhancerIt: boxEnhIt.enhancer.toIt()
  })),
  branch(
    ({ enhancerIt }) => !enhancerIt,
    renderComponent(({ onSelect }) => (
      <Flex >
        <div onClick={onSelect}>Select Enhancer</div>
      </Flex>
    ))
  ),
)(({ onClick, boxEnhIt }) => {
  return (
    <Flex column>
      <Flex justify="space-between" onClick={onClick}>
        <Box>
          {boxEnhIt.enhancer.toIt().get('name')}
        </Box>
        <Box><Icon>more_horiz</Icon></Box>
      </Flex>    
      <EnhancerOptionList boxEnhIt={boxEnhIt} />
    </Flex>    
  )
});

const EnhancerList = compose(
  withStreams({ selectedEnh$: 'activeNode.stream' }),
  withStreamProps({
    active: 'render.enahcer.active',
  }),
  branch(
    ({ active, boxIt }) => active !== boxIt.getId(),
    renderNothing,
  ),
  withHandlers({
    onAdd: ({ selectedEnh$, boxIt }) => () => {
      const enhIt = MetaModel.getInstance(selectedEnh$.get());
      if (enhIt.get('type') === 'enhancer') {
        enhIt.get('type')
      }
      const boxEnhIt = boxIt.enhancers.relClass.new({ enhancerId: enhIt.getId() });
      boxEnhIt.save();
      boxIt.enhancers.push(boxEnhIt);
    },    
  })
)(
  ({ onAdd, boxIt }) => {
    return (
      <Flex column>
        {
          boxIt.enhancers.toIt().map((boxEnhIt) => {
            console.log('boxEnhIt', boxEnhIt);
            return (<BoxEnhancerRender key={boxEnhIt.getId()} boxEnhIt={boxEnhIt}/>)
          })
        }
        <Flex justify="space-between">
          <Box onClick={onAdd}>
            <Icon>remove</Icon>
            Remove
          </Box>
          <Box onClick={onAdd}>
            <Icon>add</Icon>
            Add Enhancer
          </Box>
        </Flex>
      </Flex>
    );
  }
);

export const EnhancerRender = compose(
  withStreams({
    active$: 'render.enahcer.active',
  }),
  withHandlers({
    onSave: ({ prop, boxIt }) => (value) => {
      boxIt.set(prop, value).save();
    },
    onClick: ({ active$, boxIt }) => () => {
      active$.set(boxIt.getId())
    }
  }),
)(({ prop, value, onSave, onAdd, onClick, boxIt }) => {
  return (
    <Flex key={prop} column>
      <Flex justify="space-between" onClick={onClick}>
        <Box>{prop}</Box>
        <Box><Icon>more_horiz</Icon></Box>
      </Flex>
      <EnhancerList boxIt={boxIt} />
    </Flex>    
  )
});

export default EnhancerRender;
