import _ from 'lodash';
import { mapProps } from 'recompose';

export const pickProps = keys => mapProps(props => _.pick(props, keys));
export default pickProps;
