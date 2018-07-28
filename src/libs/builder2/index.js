import React from 'react';
import * as Components from 'reflexbox';
import _ from 'lodash';
import classnames from 'classnames';

import { compose, lifecycle, withHandlers, withProps, withState, mapProps } from 'recompose';
import invariant from 'invariant';
import { useChangedProps, omitProps } from 'libs/hoc';
import { List } from 'immutable';
import * as storage from './storage';
export { storage };

export const isFactory = (factory) => {
  return typeof factory === 'function' && factory.isFactory === true;
}

export const createFactory = (factory) => {
  invariant(typeof factory === 'function', 'Factory must be a function')
  factory.isFactory = true;
  return factory;
}

export const extendedPropsBuilder = (item) => (extendedProps) => {
  const props = {};
  Object.keys(extendedProps).map(prop => {
    props[prop] = isFactory(extendedProps[prop]) ? extendedProps[prop](item) : extendedProps[prop];
  });
  return props;
};

export const itemBuilder = (item) => (extendedProps, extendedHOC) => {
  const extProps = extendedPropsBuilder(item)(extendedProps);
  const Component = withItemWrapperEnhancer(item, extendedProps, extendedHOC)(ItemRenderComponent);
  return <Component {...extProps} />;
};

export const withChildrenBuilder = (extendedProps, extendedHOC) => withProps(({ item }) => {
  const itemIm = storage.getItem(item);
  const children = itemIm.get('children');
  if (!List.isList(children)) return { children: null };
  return { children: children.map((itemId) => itemBuilder(itemId)({ ...extendedProps, key: itemId }, extendedHOC)).toJS() };
});

export const withComponentBuilder = () => withProps(({ item }) => {
  const itemIm = storage.getItem(item);
  return { Component: _.get(Components, itemIm.get('type'))};
})

export const ItemRenderComponent = ({ Component, children, ...rest }) =>{
  return <Component {...rest} children={children} />;
} 

export const withClassNameBuilder = () => withProps(({ item, className }) => {
  const itemIm = storage.getItem(item);
  return { className: classnames(className, itemIm.get('className')) };
});

export const withStyleBuilder = () => withProps(({ item }) => {
  const itemIm = storage.getItem(item);
  console.log('dmasmsdmsdm', itemIm.get('style'));
  const style = itemIm.get('style');
  return { style: style ? style.toJS() : style };
});

export const withItemWrapperEnhancer = (itemIm, extendedProps, extendedHOC) => {
  return compose(
    withProps({ item: itemIm }),
    withHandlers({ addListener: storage.subscribe }),
    withState('itemValue', 'updateItem', ''),
    ...extendedHOC,
    lifecycle({
      componentWillMount() {
        this.disposer = this.props.addListener((newVal, oldVal) => {
          this.props.updateItem(newVal);
        });
      },
      componentWillUnmount() {
        this.disposer()
      },
    }),
    useChangedProps(['item', 'itemValue']),
    withComponentBuilder(),
    withClassNameBuilder(),
    withStyleBuilder(),
    withChildrenBuilder(extendedProps, extendedHOC),
    omitProps(['addListener', 'itemValue', 'updateItem', 'item']),
  );
};

