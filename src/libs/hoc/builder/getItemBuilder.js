import PropTypes from 'prop-types';
import { getContext } from 'recompose';
export const getItemBuilder = (propName='itemBuilder') => getContext(
  { [propName]: PropTypes.func }
);
