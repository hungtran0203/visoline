import _ from 'lodash';
import {  withProps, compose } from 'recompose';
import { withItemIm, withItemIt } from 'libs/hoc/builder';


import { Flex, Box } from 'reflexbox';
import Icon from '@material-ui/core/Icon';

let ComponentRegisterInstance = null;
class ComponentRegister {
  static getInstance() {
    if(!ComponentRegisterInstance) {
      const Class = this;
      ComponentRegisterInstance = new Class();
    }
    return ComponentRegisterInstance;
  }

  constructor() {
    this.Components = {};
  }
  get(type) {
    return _.get(this.Components, type);
  }
  register(type, Component) {
    _.set(this.Components, type, Component);
    return this;
  }
}

const instance = ComponentRegister.getInstance();
instance.register('Box', Box);
instance.register('Flex', Flex);
instance.register('Icon', Icon);

export const withComponentBuilder = () => compose(
  withItemIt(),
  withProps(({ itemIt }) => {
    if(itemIt) {
      const Component = ComponentRegister.getInstance().get(itemIt.get('type', 'Box'));
      return { Component };
    }
    return {};
  }),
);
