import { fromJS } from 'immutable';
import uuid from 'uuid';
import invariant from 'invariant';
import _ from 'lodash';
import * as storage from 'libs/storage';
import styles from './styles.scss';
import classnames from 'classnames';

export const initBox = ({ parentId }) => {
  return fromJS({
    id: uuid(),
    parentId,
    type: 'Box',
    className: classnames(styles.box),
    children: [],
  });
};

export const newRootBox = (opts) => {
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

export const deleteBox = (item) => {
  const itemIm = storage.isItemId(item) ? storage.getItemFromId(item) : item;
  const parentId = itemIm.get('parentId');
  const parentIm = storage.getItem(parentId);
  const newChildren = parentIm.get('children').filter((child) => child !== itemIm.get('id'));
  const newParent = parentIm.set('children', newChildren);
  storage.updateItem(newParent);
  storage.deleteItem(itemIm);
  return [newParent];
};

export const newRoot =  ({ setRootItem, setActiveItem }) => () => {
  const root = newRootBox();
  setRootItem(root);
  setActiveItem(root);
  return root;
};

export const doPush = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  const parentIm = storage.getParent(activeItem);
  if(parentIm) {
    insertBox(parentIm, {});
  }
};

export const doInsert = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  const [newItem, newParent ] = insertBox(activeItem, {});
  activeItem$.set(newItem);
};

export const doDelete = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  const [ newParent ] = deleteBox(activeItem);
  activeItem$.set(newParent);
};

export const toColum = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  const itemIm = storage.getItem(activeItem);
  const newItem = itemIm.set('type', 'Flex');
  storage.updateItem(newItem);
};

export const toRow = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  const itemIm = storage.getItem(activeItem);
  const newItem = itemIm.set('type', 'Box');
  storage.updateItem(newItem);
};
