import Registry from 'libs/Registry';
import React from 'react';
import { compose, withHandlers, renderComponent, branch, renderNothing, withProps } from 'recompose';
import { Flex, Box } from 'reflexbox';
import Icon from '@material-ui/core/Icon';
import { withStreams, withStreamProps } from 'libs/hoc';
import MetaModel from 'gen/visoline/model/Meta';
import AddProp from '../AddProp'
import { getRenderer, getConfigProps } from 'libs/ConfigSchema';
import _ from 'lodash';

const EnhancerOptionList = compose(
  withStreamProps({
    active: 'render.boxenahcer.active',
  }),
  branch(
    ({ active, model }) => active !== model.getId(),
    renderNothing,
  ),
  withProps(({ model }) => {
    const configId = model.enhancer.toId();
    const arrProps = getConfigProps(configId);
    const configProps = {};
    arrProps.map(prop => {
      configProps[prop] = getRenderer(configId, prop);
    })
    return { configProps };
  }),
)(
  ({ model, configProps }) => {
    return (
      <Flex column>
        {
          Object.keys(configProps).map(prop => {
            const Renderer = configProps[prop];
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
  withStreams({ active$: 'render.boxenahcer.active' }),
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
    onRemove: ({ active$, model }) => () => {
      const selectedBoxEnh = active$.get();
      if (selectedBoxEnh) {
        model.enhancers.remove(selectedBoxEnh);
      }
      console.log('rrmarmamramr', )
    }
  })
)(
  ({ onAdd, model, onRemove }) => {
    return (
      <Flex column>
        {
          model.enhancers.toIt().map((boxEnhIt) => {
            return (<BoxEnhancerRender key={boxEnhIt.getId()} model={boxEnhIt}/>)
          })
        }
        <Flex>
          <Box onClick={onRemove}>
            <Icon>remove</Icon>
          </Box>
          <Box onClick={onAdd}>
            <Icon>arrow_upward</Icon>
          </Box>
          <Box onClick={onAdd}>
            <Icon>arrow_downward</Icon>
          </Box>
          <Box onClick={onAdd}>
            <Icon>add</Icon>
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
