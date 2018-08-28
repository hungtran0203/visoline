import _ from 'lodash';
import invariant from 'invariant';
import { fromJS, Map as IMap } from 'immutable';

const storages = new Map();
const subscribers = new Map();
export const NOT_EXIST = Symbol('NOT_EXIST');

const getCollection = (colName) => {
  if(!storages.has(colName)) {
    storages.set(colName, {});
  }
  return storages.get(colName);
};

const getSubscribers = (colName) => {
  if(!subscribers.has(colName)) {
    subscribers.set(colName, {});
  }
  return subscribers.get(colName);  
};

export const isItemId = (itemId) => {
  return typeof itemId === 'string';
};

export const getItemId = (itemId) => {
  if ( !itemId ) return null;
  if (isItemId(itemId))  return itemId;
  if (IMap.isMap(itemId)) return itemId.get('id');
  return _.get(itemId, 'id');
};

export const getItemFromId = (colName, itemId) => {
  return _.get(getCollection(colName), itemId, NOT_EXIST);
};

export const getItem = (colName, item) => {
  const itemId = getItemId(item);
  if (!itemId) return NOT_EXIST;
  return getItemFromId(colName, itemId);
};

export const subscribe = (colName, item, listener) => {
  const itemId = getItemId(item);
  const subscribers = getSubscribers(colName);
  subscribers[itemId] = subscribers[itemId] || [];
  subscribers[itemId].push(listener);
  const disposer = () => {
    subscribers[itemId].splice(subscribers[itemId].indexOf(listener), 1);
  };
  return disposer;
};

export const updateItem = (colName, item) => {
  const itemId = getItemId(item);
  const collection = getCollection(colName);
  const oldVal = _.get(collection, itemId);
  if(oldVal !== item) {
    const subscribers = getSubscribers(colName);
    _.set(collection, itemId, item);
    const listeners = subscribers[itemId];
    if(Array.isArray(listeners)) {
      listeners.map(listener => listener(item, oldVal))
    }  
  }
};

export const deleteItem = (colName, item) => {
  const itemId = getItemId(item);
  const collection = getCollection(colName);
  const subscribers = getSubscribers(colName);
  delete collection[itemId];
  subscribers[itemId] = [];
};

export const find = (colName, condition) => {
  const collection = getCollection(colName);
  return _.find(collection, condition);
};

export const findAll = (colName, condition) => {
  const collection = getCollection(colName);
  return _.filter(collection, condition);
};
