import React from 'react';
import styles from './styles.css';
import classnames from 'classnames';
import * as Components from 'reflexbox';
import { compose, withHandlers, withProps } from 'recompose';
import { withStreamProps, withStreams, getStream } from 'libs/hoc';
import { fromJS } from 'immutable';
import uuid from 'uuid';
import invariant from 'invariant';
import _ from 'lodash';
import * as builder from 'libs/builder';

const { Flex, Box } = Components;

export const Layout = ({ doPush, doInsert, newRoot, rootItem }) => {
  console.log('rootItem', rootItem);
  return (
    <div  className={classnames(styles.container)}>
      <Flex>
        {rootItem && builder.itemBuilder(rootItem)({ onClick })}
      </Flex>
      <Flex className={styles.actions} justify="space-between">
        <Box w={100} className={styles.btn} onClick={newRoot}>New</Box>
        <Box w={100} className={styles.btn} onClick={doPush}>Push</Box>
        <Box w={100} className={styles.btn} onClick={doInsert}>Insert</Box>
      </Flex>
    </div>
  );
}

const DATA_STREAM = 'data.stream';
const ROOT_ITEM_STREAM = 'data.root.stream';
const ACTIVE_ITEM_STREAM = 'activeItem.stream';

const onClick = builder.createFactory((item) => (e) => {
  // e.preventDefault();
  e.stopPropagation();
  console.log('click me', item, item.toJS());
  getStream(ACTIVE_ITEM_STREAM).set(item);
  return false;
});


export const initBox = ({ parentId }) => {
  return fromJS({
    id: uuid(),
    parentId,
    type: 'Box',
    className: classnames(styles.box),
    text: 'abox',
    children: [],
  });
};

export const newRoot = (opts) => {
  const newBox = initBox({ ...opts, parentId: null });
  builder.updateItem(newBox);
  return newBox;
};

export const insertBox = (parentItem, opts) => {
  const parent = builder.isItemId(parentItem) ? builder.getItemFromId(parentItem) : parentItem;
  invariant(parent, `Parent Box (${parentItem}) does not exists`);
  const parentId = builder.isItemId(parentItem) ? parentItem : parent.get('id');
  const newBox = initBox({ ...opts, parentId });
  const children = parent.get('children', fromJS([])).push(builder.getItemId(newBox));
  builder.updateItem(newBox);
  const newParent = parent.set('children', children);
  builder.updateItem(newParent);
  return [newBox, newParent];
};

export default compose(
  withStreamProps({
    rootItem: [ROOT_ITEM_STREAM],
  }),
  withStreams({
    rootItem$: [ROOT_ITEM_STREAM, { init: null }],
    activeItem$: [ACTIVE_ITEM_STREAM, { init: null }],
  }),
  withHandlers({
    setRootItem: ({ rootItem$ }) => (rootItem) => rootItem$.set(rootItem),
    setActiveItem: ({ activeItem$ }) => (activeItem) => activeItem$.set(activeItem),
  }),
  withHandlers({
    newRoot: ({ setRootItem, setActiveItem }) => () => {
      const root = newRoot();
      setRootItem(root);
      setActiveItem(root);
      return root;
    },
    doPush: ({ activeItem$ }) => () => {
      const activeItem = activeItem$.get();
      if(activeItem && activeItem.get('parentId')) {
        const parentBox = builder.getItemFromId(activeItem.get('parentId'), true);
        insertBox(parentBox.id, {});
      }
    },
    doInsert: ({ activeItem$ }) => () => {
      const activeItem = activeItem$.get();
      const [newItem, newParent ] = insertBox(activeItem, {});
      activeItem$.set(newItem);
    }
  }),
)(Layout);