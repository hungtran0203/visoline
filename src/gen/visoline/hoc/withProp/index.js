import { withProps } from 'recompose';
import Registry from 'libs/Registry';

export const withProp = ({ propName, propValue }) => {
  return withProps(() => ({ [propName]: propValue}));
};

export default withProp;
