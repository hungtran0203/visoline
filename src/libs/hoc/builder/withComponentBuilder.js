import _ from 'lodash';
import {  withProps, compose } from 'recompose';
import * as Components from 'reflexbox';
import { withItemIm } from 'libs/hoc/builder';

export const withComponentBuilder = () => compose(
  withItemIm(),
  withProps(({ itemIm }) => {
    if(itemIm) {
      return { Component: _.get(Components, itemIm.get('type'))};
    }
    return {};
  }),
);
