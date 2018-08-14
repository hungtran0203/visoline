import { ITEM_SELECTION_STREAM } from 'libs/hoc/editor';
import { withStreamProps, withStreams } from 'libs/hoc';

const OPTIONS = { init: [] };

export const withSelectedItems = (propName='selectedItems', format='') => withStreamProps({
  [propName]: [ITEM_SELECTION_STREAM, OPTIONS],
});

export const withSelectedItems$ = (propName='selectedItems$') => withStreams({
  [propName]: [ITEM_SELECTION_STREAM, OPTIONS],
});
