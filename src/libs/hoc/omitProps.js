import _ from 'lodash';
import { mapProps } from 'recompose';

export const omitProps = keys => mapProps(props => _.omit(props, keys));
export default omitProps;
