import _ from 'lodash';
import {  withProps } from 'recompose';
import storage from 'libs/storage';
import * as Components from 'reflexbox';

export const withComponentBuilder = () => withProps(({ item }) => {
  const itemIm = storage.getItem(item);
  return { Component: _.get(Components, itemIm.get('type'))};
});
