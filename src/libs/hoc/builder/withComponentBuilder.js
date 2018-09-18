import _ from 'lodash';
import {  withProps, compose } from 'recompose';
import { withItemIm, withItemIt } from 'libs/hoc/builder';


import { Flex, Box } from 'reflexbox';
import Icon from '@material-ui/core/Icon';
import Registry from 'libs/Registry';

Registry('COMPONENT').register('Box', Box);
Registry('COMPONENT').register('Flex', Flex);
Registry('COMPONENT').register('Icon', Icon);

const objectFormatter = v => v;

export const withComponentBuilder = () => compose(
  withItemIt(),
  withProps(({ itemIt }) => {
    if(itemIt) {
      const componentId = Registry.refValueToString(itemIt.get('component', 'Box'), objectFormatter);
      let Component;
      if (typeof componentId === 'string') {
        Component = Registry('COMPONENT').get(componentId);
      } else {
        const { type, id } = componentId;
        Component = Registry(type).get(id);
      }
      return { Component };
    }
    return {};
  }),
);
