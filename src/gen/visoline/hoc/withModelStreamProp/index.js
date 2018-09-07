import { compose } from 'recompose';
import { omitProps, withStreamProps } from 'libs/hoc';
import withModel from '../withModel';

export const withModelStreamProp = ({ srcStream, model: Model, dstProp, watching=false }) => {
  const STREAM_VALUE_PROP = '$$streamValue';
  return compose(
    withStreamProps({
      [STREAM_VALUE_PROP]: [srcStream, { init: null }],
    }),
    withModel({
      srcProp: STREAM_VALUE_PROP, model: Model, dstProp, watching
    }),
    omitProps(Object.values([STREAM_VALUE_PROP])),
  )
};

export default withModelStreamProp;
