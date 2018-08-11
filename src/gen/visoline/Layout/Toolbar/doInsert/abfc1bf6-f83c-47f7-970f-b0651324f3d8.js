import * as storage from 'libs/storage';
import invariant from 'invariant';
import { fromJS } from 'immutable';
import uuid from 'uuid';
import classnames from 'classnames';

const initBox = ({ parentId }) => {
  return fromJS({
    id: uuid(),
    parentId,
    type: 'Box',
    className: classnames('defaultBox'),
    children: [],
  });
};

const insertBox = (parentItem, opts) => {
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

export const doInsert = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  const [newItem, newParent ] = insertBox(activeItem, {});
  activeItem$.set(newItem);
};
