import React from 'react';
import styles from './styles.css';
import classnames from 'classnames';
import * as Components from 'reflexbox';
import { compose, withHandlers, withProps, branch, renderNothing } from 'recompose';
import { withStreamProps, withStreams, getStream } from 'libs/hoc';
import { fromJS } from 'immutable';
import uuid from 'uuid';
import invariant from 'invariant';
import _ from 'lodash';
import * as storage from 'libs/storage';

import { withActivation, ACTIVE_ELEMENT_STREAM, ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import { withItemWatcher, withItemBuilder, getItemBuilder } from 'libs/hoc/builder';
import CSSStyleInspector from 'components/CSSStyleInspector';

const { Flex, Box } = Components;

const editorHOC = [
  withActivation(),
  withItemWatcher(),
];

const RootItemComponent = compose(
  withItemBuilder(editorHOC),
  getItemBuilder(),
  branch(
    ({ item }) => !item,
    renderNothing,
  )
)(({ itemBuilder, item }) => itemBuilder()(item));

export const Layout = ({ doPush, doInsert, newRoot, rootItem }) => {
  console.log('rootItem', rootItem);
  return (
    <Flex>
      <Box auto>
        <div  className={classnames(styles.container)}>
          <Flex>
            <RootItemComponent item={rootItem} />
          </Flex>
        </div>
      </Box>
      <Flex w={200} justify="space-between" column>
        <Flex>
          <Box auto className={styles.btn} onClick={newRoot}>New</Box>
          <Box auto className={styles.btn} onClick={doPush}>Span</Box>
          <Box auto className={styles.btn} onClick={doInsert}>Insert</Box>
        </Flex>
        <ActiveBoxPanel />
      </Flex>
    </Flex>
  );
}

const ActiveBoxPanel = compose(
  withStreamProps({
    activeElement: [ACTIVE_ELEMENT_STREAM],
  }),
  branch(
    ({ activeElement }) => !activeElement,
    renderNothing,
  )
)(({ activeElement }) => {
  const cs = window.getComputedStyle(activeElement,null);
  return (
    <Flex column>
      <Flex>
        <Box>Width: {activeElement.offsetWidth} px</Box>
        <Box></Box>
      </Flex>
      <Flex>
        <Box>Height: {activeElement.offsetHeight} px</Box>
        <Box></Box>
      </Flex>
      <Flex>
        <Box>Clien Width: {activeElement.clientWidth} px</Box>
        <Box></Box>
      </Flex>
      <Flex>
        <Box>Clien Height: {activeElement.clientHeight} px</Box>
        <Box></Box>
      </Flex>
      <Flex>
        <Box>Width: </Box>
        <Box>{cs.getPropertyValue('width')}</Box>
      </Flex>
      <CSSStyleInspector element={activeElement}/>
    </Flex>
  );
});

const DATA_STREAM = 'data.stream';
const ROOT_ITEM_STREAM = 'data.root.stream';

export const initBox = ({ parentId }) => {
  return fromJS({
    id: uuid(),
    parentId,
    type: 'Box',
    className: classnames(styles.box),
    children: [],
  });
};

export const newRoot = (opts) => {
  const newBox = initBox({ ...opts, parentId: null });
  storage.updateItem(newBox);
  return newBox;
};

export const insertBox = (parentItem, opts) => {
  const parent = storage.isItemId(parentItem) ? storage.getItemFromId(parentItem) : parentItem;
  invariant(parent, `Parent Box (${parentItem}) does not exists`);
  const parentId = storage.isItemId(parentItem) ? parentItem : parent.get('id');
  const newBox = initBox({ ...opts, parentId });
  const children = parent.get('children', fromJS([])).push(storage.getItemId(newBox));
  storage.updateItem(newBox);
  const newParent = parent.set('children', children);
  storage.updateItem(newParent);
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
        const parentBox = storage.getItemFromId(activeItem.get('parentId'), true);
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