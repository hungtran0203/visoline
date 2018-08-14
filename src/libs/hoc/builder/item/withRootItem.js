import { ROOT_ITEM_STREAM } from 'constants';
import { withHandlers, compose } from 'recompose';
import { withStreamProps, withStreams } from 'libs/hoc';
import { withItemWatcher } from 'libs/hoc/builder';
import Item from 'libs/storage/item';

const OPTIONS = { init: null };

export const withRootItem = (propName='rootItem', format='') => withStreamProps({
  [propName]: [ROOT_ITEM_STREAM, OPTIONS],
});

export const withRootItem$ = (propName='rootItem$') => withStreams({
  [propName]: [ROOT_ITEM_STREAM, OPTIONS],
});

export const setRootItem = (propName='setRootItem', streamName='rootItem$') => withHandlers({
  [propName]: (props) => (val) => props[streamName].set(val),
});

export const withRootItemWatcher = (propName='rootItem') => compose(
  withRootItem(propName),
  withItemWatcher(propName),
);

export const withNewRootHandler = (propName='addRoot') => compose(
  withRootItem(),
  withHandlers({
    [propName]: ({ rootItem$ }) => () => {
      const newRoot = Item.newInstance();
      rootItem$.set(newRoot.save().toIm());
      return root;
    },
  }),
);
