import { compose, withProps } from 'recompose';
import { omitProps, withStreams } from 'libs/hoc';

export const withModelStream = ({ srcStream, model: Model, dstProp }) => {
  const STREAM_VALUE_PROP = '$$streamValue$';
  return compose(
    withStreams({
      [STREAM_VALUE_PROP]: [srcStream, { init: null }],
    }),
    withProps((props) => ({
      [dstProp]: {
        get: () => {
          const stream$ = props[STREAM_VALUE_PROP];
          return Model.getInstance(stream$.get());
        },
        set: (value) => props[STREAM_VALUE_PROP].set(value),
      }
    })),
    omitProps(Object.values([STREAM_VALUE_PROP])),
  )
};

export default withModelStream;
