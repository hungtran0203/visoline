import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import { withHandlers } from 'recompose';
import { withStreamProps, withStreams } from 'libs/hoc';

const OPTIONS = { init: null };

export const withActiveItem = (propName='activeItem', format='') => withStreamProps({
  [propName]: [ACTIVE_ITEM_STREAM, OPTIONS],
});

export const withActiveItem$ = (propName='activeItem$') => withStreams({
  [propName]: [ACTIVE_ITEM_STREAM, OPTIONS],
});

export const setActiveItem = (propName='setActiveItem', streamName='activeItem$') => withHandlers({
  [propName]: (props) => (val) => props[streamName].set(val),
});
