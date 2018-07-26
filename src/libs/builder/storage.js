import _ from 'lodash';
import invariant from 'invariant';

const storage = {};
const subscribers = {};

export const isItemId = (itemId) => {
  return typeof itemId === 'string';
};

export const getItemId = (itemId) => {
  return isItemId(itemId) ? itemId : itemId.get('id');
}

export const getItemFromId = (itemId, toJS=0) => {
  const item = _.get(storage, itemId);
  invariant(item, `Item (${itemId}) does not exists`);
  return toJS ? item.toJS() : item;
};

export const getItem = (item, toJS=0) => {
  const itemId = getItemId(item);
  return getItemFromId(itemId, toJS);
};

export const updateItem = (item) => {
  const itemId = item.get('id');
  const oldVal = _.get(storage, itemId);
  if(oldVal !== item) {
    _.set(storage, itemId, item);
    const listeners = subscribers[itemId];
    if(Array.isArray(listeners)) {
      listeners.map(listener => listener(item, oldVal))
    }
  }
};

export const subscribe = ({ item }) => (listener) => {
  const itemId = getItemId(item);
  subscribers[itemId] = subscribers[itemId] || [];
  subscribers[itemId].push(listener);
  const disposer = () => {
    subscribers[itemId].splice(subscribers[itemId].indexOf(listener), 1);
  };
  return disposer;
};
