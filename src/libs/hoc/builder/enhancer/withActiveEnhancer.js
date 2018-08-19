import { withHandlers } from 'recompose';
import { withStreamProps, withStreams } from 'libs/hoc';

const OPTIONS = { init: null };
const ACTIVE_ENHANCER_STREAM = 'active.enhancer.stream';

export const withActiveEnhancer = (propName='activeEnhancer', format='') => withStreamProps({
  [propName]: [ACTIVE_ENHANCER_STREAM, OPTIONS],
});

export const withActiveEnhancer$ = (propName='activeEnhancer$') => withStreams({
  [propName]: [ACTIVE_ENHANCER_STREAM, OPTIONS],
});

export const setActiveEnhancer = (propName='setActiveEnhancer', streamName='activeEnhancer$') => withHandlers({
  [propName]: (props) => (val) => props[streamName].set(val),
});
