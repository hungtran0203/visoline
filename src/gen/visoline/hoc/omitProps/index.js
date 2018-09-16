import { withHandlers } from 'recompose';
import { omitProps } from 'libs/hoc';
import Registry from 'libs/Registry';

export const hoc = ({ propNames }) => omitProps(propNames);

export default hoc;
