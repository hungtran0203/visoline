
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {  withProps, withContext, compose } from 'recompose';
import { withComponentBuilder } from './withComponentBuilder';
import { withClassNameBuilder } from './withClassNameBuilder';
import { withStyleBuilder } from './withStyleBuilder';
import { withChildrenBuilder } from './withChildrenBuilder';

const BaseItemComponent = ({ Component, ...rest }) =>{
  return <Component {...rest} />;
} 

export const withItemBuilder = (extendedHOC) => withContext(
  { itemBuilder: PropTypes.func },
  () => ({ 
    itemBuilder: (extraProps) => (item) => {
      const hoc = [...extendedHOC];
      const Component = compose(
        ...hoc,
        withClassNameBuilder(),
        withStyleBuilder(),
        withComponentBuilder(),
        withChildrenBuilder(),
      )(BaseItemComponent);

      return <Component item={item} {...extraProps} />;
    },
  }),
);
