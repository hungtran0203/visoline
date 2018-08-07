import { compose, withHandlers } from 'recompose';
import { withStreams, withStreamProps } from 'libs/hoc';
import { ROOT_ITEM_STREAM } from 'constants';
import { withItemWatcher } from 'libs/hoc/builder';
import * as storage from 'libs/storage';
import uuid from 'uuid';
import { fromJS } from 'immutable';
import classnames from 'classnames';

const initBox = ({ parentId }) => {
  return fromJS({
    id: uuid(),
    name: parentId ? 'Item' : 'Page',
    parentId,
    type: 'Box',
    className: classnames('defaultBox'),
    children: [],
  });
};

const newRootBox = (opts) => {
  const newBox = initBox({ ...opts, parentId: null });
  storage.updateItem(newBox);
  return newBox;
};

export const withRootItem = (propName='rootItem') => withStreamProps({
  [propName]: [ROOT_ITEM_STREAM, { init: null }],
});

export const withRootItemStream = (propName='rootItem$') => withStreams({
  [propName]: [ROOT_ITEM_STREAM, { init: null }],
});

export const withRootItemWatcher = (propName='rootItem') => compose(withRootItem(propName), withItemWatcher(propName));

export const withNewRootHandler = (propname='addRoot') => compose(
  withRootItemStream(),
  withHandlers({
    [propname]: ({ rootItem$ }) => () => {
      const newRoot = newRootBox();
      rootItem$.set(newRoot);
      return root;
    },
  }),
);
