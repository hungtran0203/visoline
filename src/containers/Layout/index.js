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

const { Flex, Box } = Components;

export const Layout = ({ doPush, doInsert, newRoot, rootItem }) => {
  console.log('rootItem', rootItem);
  return (
    <div  className={classnames(styles.container)}>
      <Flex>
        {rootItem && buildItem(rootItem)}
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

const onClick = (index) => (e) => {
  // e.preventDefault();
  e.stopPropagation();
  getStream(ACTIVE_ITEM_STREAM).set(index);
  return false;
};


const buildItem = (item) => {
  const itemObj = isBoxId(item) ? getBoxFromId(item) : item;
  const { type, id, parentId, children, ...rest } = itemObj.toJS();
  const Com = Components[type];
  let subItems;
  if(children && children.length) {
    subItems = buildItems(children);
  }
  if(subItems) {
    return <Com {...rest} onClick={onClick(id)} >{subItems}</Com>;
  }
  return <Com {...rest} onClick={onClick(id)} />;
}

const buildItems = (items) => {
  return items.map((item) => {
    const { type, id, parentId, children, ...rest } = item;
    const Com = Components[type];
    let subItems;
    if(children && children.length) {
      subItems = buildItems(children);
    }
    if(subItems) {
      return <Com {...rest} key={id} onClick={onClick(id)} >{subItems}</Com>;
    }
    return <Com {...rest} key={id} onClick={onClick(id)} />;
  })
}

export const isBoxId = (boxId) => {
  return typeof boxId === 'string';
}

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
  const data$ = getDataStream()
  const newBox = initBox({ ...opts, parentId: null });
  data$.set(data$.get().set(newBox.get('id'), newBox));
  return newBox;
};

const initData = fromJS({});
export const getDataStream = () => getStream(DATA_STREAM, { init: initData });

export const insertBox = (parentBox, opts) => {
  const data$ = getDataStream();
  const parentId = isBoxId(parentBox) ? parentBox : _.get(parentBox, 'id');
  const data = data$.get();
  const parent = data.get(parentId);
  invariant(parent, `Parent Box (${parentId}) does not exists`);
  const newBox = initBox({ ...opts, parentId });
  const children = parent.get('children', fromJS([])).push(newBox);
  data$.set(data.asMutable()
    .set(newBox.get('id'), newBox)
    .setIn([parentId, 'children'], children)
    .asImmutable()
  );
};

export const getBoxFromId = (boxId, toJS=0) => {
  const data$ = getDataStream();
  const box = data$.get().get(boxId);
  invariant(box, `Box (${boxId}) does not exists`);
  return toJS ? box.toJS() : box;
}


export default compose(
  withStreamProps({
    data: [DATA_STREAM, { init: initData }],
    rootId: [ROOT_ITEM_STREAM],
  }),
  withStreams({
    rootId$: [ROOT_ITEM_STREAM],
    activeItem$: [ACTIVE_ITEM_STREAM, { init: 0 }],
  }),
  withHandlers({
    setRootId: ({ rootId$ }) => (rootId) => rootId$.set(rootId),
    setActiveId: ({ activeItem$ }) => (activeId) => activeItem$.set(activeId),
  }),
  withHandlers({
    newRoot: ({ setRootId, setActiveId }) => () => {
      const root = newRoot();
      setRootId(root.get('id'));
      setActiveId(root.get('id'));
      return root;
    },
    doPush: ({ activeItem$ }) => () => {
      console.log('dopush', activeItem$.get());
      const activeId = activeItem$.get() || 0;
      console.log('aaa', activeId);
      const activeBox = getBoxFromId(activeId, true);
      console.log('aaa', activeBox);
      const parentBox = getBoxFromId(activeBox.parentId, true);
      insertBox(parentBox.id, {});
    },
    doInsert: ({ activeItem$ }) => () => {
      const activeId = activeItem$.get() || 0;
      console.log('activeIdactiveIdactiveId', activeId);
      insertBox(activeId, {});
    }
  }),
  withProps(({ rootId, data }) => {
    console.log('rrrr', rootId, data);
    return {rootItem: !!rootId ? getBoxFromId(rootId) : null };
  }),
)(Layout);