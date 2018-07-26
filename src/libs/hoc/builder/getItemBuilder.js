import PropTypes from 'prop-types';
import { getContext } from 'recompose';
export const getItemBuilder = () => getContext(
  { itemBuilder: PropTypes.func }
);
