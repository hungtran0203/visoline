import _ from 'lodash';
import invariant from 'invariant';
import { fromJS } from 'immutable';

const storage = {};
const subscribers = {};

export const isItemId = (itemId) => {
  return typeof itemId === 'string';
};

export const getItemId = (itemId) => {
  if ( !itemId ) return null;
  return isItemId(itemId) ? itemId : itemId.get('id');
}

export const getItemFromId = (itemId, toJS=0) => {
  const item = _.get(storage, itemId);
  if (!item) return null;
  return toJS ? item.toJS() : item;
};

export const getItem = (item, toJS=0) => {
  const itemId = getItemId(item);
  if (!itemId) return null;
  return getItemFromId(itemId, toJS);
};

export const toJS = () => {
  return fromJS(storage).toJS();
};

export const load = (data) => {
  Object.keys(data).map(key => {
    updateItem(fromJS(data[key]));
  })
};

const transactionStack = [];

export const transactionStart = () => {
  transactionStack.push({});
};

export const transactionEnd = () => {
  const updatedItemIds = transactionStack.pop();
  if (updatedItemIds) {
    Object.keys(updatedItemIds).map(key => {
      const [item, oldVal] = updatedItemIds[key];
      if(oldVal !== item) {
        const itemId = getItemId(item);
        const listeners = subscribers[itemId];
        if(Array.isArray(listeners)) {
          listeners.map(listener => listener(item, oldVal))
        }  
      }
    })
  }
};

const isInTransaction = () => {
  return !!transactionStack.length;
}

export const updateItem = (item) => {
  const itemId = item.get('id');
  const oldVal = _.get(storage, itemId);
  if(oldVal !== item) {
    _.set(storage, itemId, item);
    if(isInTransaction()) {
      const updatedItemIds = transactionStack[transactionStack.length - 1];
      updatedItemIds[itemId] = [item, oldVal];
    } else {
      const listeners = subscribers[itemId];
      if(Array.isArray(listeners)) {
        listeners.map(listener => listener(item, oldVal))
      }  
    }
  }
};

export const deleteItem = (item) => {
  const itemIm = getItem(item);
  const itemId = itemIm.get('id');
  delete storage[itemId];
  subscribers[itemId] = [];
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

export const getParent = (item) => {
  const itemIm = getItem(item);
  if (itemIm) {
    const parentId = itemIm.get('parentId');
    if (parentId) {
      return getItem(parentId);
    }  
  }
};

export const getChild = (item, nChild = 0 ) => {
  const itemIm = getItem(item);
  if (itemIm) {
    const children = itemIm.get('children');
    if (children) {
      const childId = children.get(nChild);
      if (isItemId(childId)) {
        return getItem(childId);
      }
    }  
  }
};

export const getChildren = (item) => {
  const itemIm = getItem(item);
  if (itemIm) {
    return itemIm.get('children').toJS();
  }  
}

export const getSiblings = (item, dir = 1 ) => {
  const itemIm = getItem(item);
  const parentIm = getParent(item);
  let siblings = [];
  if (itemIm && parentIm) {
    const children = parentIm.get('children');
    if (children) {
      const index = children.indexOf(getItemId(itemIm));
      if (index >= 0) {
        const range = dir > 0 ? [ index + 1, index + dir + 1 ] : [ index + dir, index ];
        siblings = children.slice(...range).toJS();
      }
    }  
  }
  return siblings;
};

export const buildTree = (item) => {
  const itemIm = getItem(item);
  if (!itemIm) return null;
  const tree = {};
  const children = itemIm.get('children').toJS();
  let subTree = [];
  if (children.length) {
    children.map(child => {
      subTree.push(buildTree(child));
    })
  }
  tree[itemIm.get('id')] = subTree;
  return tree;
};

export const getItems = () => Object.keys(storage);

export const isRootItem = (item) => {
  const itemIm = getItem(item);
  return itemIm && !getParent(itemIm);
}