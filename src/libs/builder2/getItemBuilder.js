import { getContext } from 'recompose';
import React from 'react';
export const getItemBuilder = () => getContext(
  { itemBuilder: React.PropTypes.func }
);
