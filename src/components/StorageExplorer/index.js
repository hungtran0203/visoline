import React from 'react';
import styles from './styles.scss';
import * as storage from 'libs/storage';
import classnames from 'classnames';
import { compose, withHandlers } from 'recompose';
import { withStreams, withStreamProps } from 'libs/hoc';
import { ROOT_ITEM_STREAM } from 'constants';

const RootItemExplorer = compose(
  withStreamProps({
    rootItem: [ROOT_ITEM_STREAM],
  }),
  withStreams({
    rootItem$: [ROOT_ITEM_STREAM, { init: null }],
  }),
  withHandlers({
    onClick: ({ rootItem$, item }) => () => rootItem$.set(item),
  }),
)(({ item , onClick, rootItem }) => {
  const itemIm = storage.getItem(item);
  const activeRootIm = storage.getItem(rootItem);
  const isActive = activeRootIm && activeRootIm.get('id') === itemIm.get('id');
  return (
    <div className={classnames(styles.container, { [styles.isActive]: isActive })} onClick={onClick}>
      {
        itemIm.get('id')
      }
    </div>
  )
});

export const StorageExplorer = ({ children, ratio }) => (
  <div className={styles.square}>
  {
    storage.getItems().map(itemId => {
      if (!storage.isRootItem(itemId)) return null;
      return (
        <div key={itemId}>
          <RootItemExplorer item={itemId} />
        </div>
      )
    })
  }
  </div>
);

export default StorageExplorer;
