import register from 'libs/register';
import React from 'react';
import { compose, withHandlers, withState, renderComponent, branch, renderNothing, withProps } from 'recompose';
import EditableText from 'components/EditableText';
import { Flex, Box } from 'reflexbox';
import Icon from '@material-ui/core/Icon';
import { withStreams, withStreamProps, omitProps, composeHandler } from 'libs/hoc';
import MetaModel from 'libs/loader/meta';
import AddProp from '../AddProp'
import EditableRender from '../EditableRender'
import { getRenderer, getConfigProps } from 'libs/ConfigSchema';

const EnhancerOptionList = compose(
  withStreamProps({
    active: 'render.boxenahcer.active',
  }),
  branch(
    ({ active, model }) => active !== model.getId(),
    renderNothing,
  ),
)(
  ({ model }) => {
    return (
      <Flex column>
        {
          getConfigProps(model).map(prop => {
            const Renderer = getRenderer(model, prop);
            const value = model.get(prop);
            return (
              <Renderer key={prop} prop={prop} value={value} model={model} />
            )
          })
        }
        <AddProp model={model} />
      </Flex>
    );
  }
);

const BoxEnhancerRender = compose(
  withStreams({ selectedEnh$: 'activeNode.stream' }),
  withStreams({ active$: 'render.boxenahcer.active' }),
  withHandlers({
    onClick: ({ active$, model }) => () => {
      active$.set(model.getId())
    },
    onSelect: ({ selectedEnh$, model }) => () => {
      const enhIt = MetaModel.getInstance(selectedEnh$.get());
      if (enhIt.get('type') === 'enhancer') {
        enhIt.get('type')
      }
      model.enhancer.changeTo(enhIt);
    },
  }),
  withProps(({ model }) => ({
    enhancerIt: model.enhancer.toIt()
  })),
  branch(
    ({ enhancerIt }) => !enhancerIt,
    renderComponent(({ onSelect }) => (
      <Flex >
        <div onClick={onSelect}>Select Enhancer</div>
      </Flex>
    ))
  ),
)(({ onClick, model }) => {
  return (
    <Flex column>
      <Flex justify="space-between" onClick={onClick}>
        <Box>
          {model.enhancer.toIt().get('name')}
        </Box>
        <Box><Icon>more_horiz</Icon></Box>
      </Flex>    
      <EnhancerOptionList model={model} />
    </Flex>    
  )
});

const EnhancerList = compose(
  withStreams({ selectedEnh$: 'activeNode.stream' }),
  withStreamProps({
    active: 'render.enahcer.active',
  }),
  branch(
    ({ active, model }) => active !== model.getId(),
    renderNothing,
  ),
  withHandlers({
    onAdd: ({ selectedEnh$, model }) => () => {
      const enhIt = MetaModel.getInstance(selectedEnh$.get());
      if (enhIt.get('type') === 'enhancer') {
        enhIt.get('type')
      }
      const boxEnhIt = model.enhancers.relClass.new({ enhancerId: enhIt.getId() });
      boxEnhIt.save();
      model.enhancers.push(boxEnhIt);
    },    
  })
)(
  ({ onAdd, model }) => {
    return (
      <Flex column>
        {
          model.enhancers.toIt().map((boxEnhIt) => {
            return (<BoxEnhancerRender key={boxEnhIt.getId()} model={boxEnhIt}/>)
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
    onSave: ({ prop, model }) => (value) => {
      model.set(prop, value).save();
    },
    onClick: ({ active$, model }) => () => {
      active$.set(model.getId())
    }
  }),
)(({ prop, value, onSave, onAdd, onClick, model }) => {
  return (
    <Flex key={prop} column>
      <Flex justify="space-between" onClick={onClick}>
        <Box>{prop}</Box>
        <Box><Icon>more_horiz</Icon></Box>
      </Flex>
      <EnhancerList model={model} />
    </Flex>    
  )
});

export default EnhancerRender;

register('CONFIG_UI').register('enhancer', EnhancerRender);
