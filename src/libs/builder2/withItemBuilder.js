
import _ from 'lodash';
import React from 'react';
import {  withProps, withContext, compose } from 'recompose';
import { withComponentBuilder } from './withComponentBuilder';
import { withClassNameBuilder } from './withClassNameBuilder';
import { withStyleBuilder } from './withStyleBuilder';

const BaseItemComponent = ({ Component, ...rest }) =>{
  return <Component {...rest} />;
} 

export const withItemBuilder = (extendedHOC) => withContext(
  { itemBuilder: React.PropTypes.func },
  () => ({ 
    itemBuilder: (item, extraProps) => {
      const hoc = [...extendedHOC];
      const Component = compose(
        withClassNameBuilder(),
        withStyleBuilder(),
        withComponentBuilder(),
        ...hoc,
      )(BaseItemComponent);
      return <Component item={item} {...extraProps} />;
    },
  }),
);
