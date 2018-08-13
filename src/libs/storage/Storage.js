import _ from 'lodash';
import invariant from 'invariant';
import { fromJS } from 'immutable';

const storages = new Map();
class Storage {
  static domain(dm) {
    if (!storages.has(dm)) {
      storages.set(dm, new Storage(dm));
    }
    return storages.get(dm);
  }

  transactionStack = [];
  storage = {};
  subscribers = {};
  constructor(domain) {
    this.domain = domain;
  }
  
  isItemId = (itemId) => {
    return typeof itemId === 'string';
  }

  getItemId = (itemId) => {
    if ( !itemId ) return null;
    return isItemId(itemId) ? itemId : itemId.get('id');
  }

  getItemFromId = (itemId, toJS=0) => {
    const item = _.get(this.storage, itemId);
    if (!item) return null;
    return toJS ? item.toJS() : item;
  }

  getItem = (item, toJS=0) => {
    const itemId = getItemId(item);
    if (!itemId) return null;
    return getItemFromId(itemId, toJS);
  }

  toJS = () => {
    return fromJS(this.storage).toJS();
  }

  load = (data) => {
    Object.keys(data).map(key => {
      updateItem(fromJS(data[key]));
    })
  }

  transactionStart = () => {
    transactionStack.push({});
  }

  transactionEnd = () => {
    const updatedItemIds = transactionStack.pop();
    if (updatedItemIds) {
      Object.keys(updatedItemIds).map(key => {
        const [item, oldVal] = updatedItemIds[key];
        if(oldVal !== item) {
          const itemId = getItemId(item);
          const listeners = this.subscribers[itemId];
          if(Array.isArray(listeners)) {
            listeners.map(listener => listener(item, oldVal))
          }  
        }
      })
    }
  }  

  isInTransaction = () => {
    return !!transactionStack.length;
  }

  updateItem = (item) => {
    const itemId = item.get('id');
    const oldVal = _.get(this.storage, itemId);
    if(oldVal !== item) {
      _.set(this.storage, itemId, item);
      if(isInTransaction()) {
        const updatedItemIds = transactionStack[transactionStack.length - 1];
        updatedItemIds[itemId] = [item, oldVal];
      } else {
        const listeners = this.subscribers[itemId];
        if(Array.isArray(listeners)) {
          listeners.map(listener => listener(item, oldVal))
        }  
      }
    }
  }

  deleteItem = (item) => {
    const itemIm = getItem(item);
    const itemId = itemIm.get('id');
    delete this.storage[itemId];
    this.subscribers[itemId] = [];
  }

  subscribe = ({ item }) => (listener) => {
    const itemId = getItemId(item);
    this.subscribers[itemId] = this.subscribers[itemId] || [];
    this.subscribers[itemId].push(listener);
    const disposer = () => {
      this.subscribers[itemId].splice(this.subscribers[itemId].indexOf(listener), 1);
    };
    return disposer;
  }

  getParent = (item) => {
    const itemIm = getItem(item);
    if (itemIm) {
      const parentId = itemIm.get('parentId');
      if (parentId) {
        return getItem(parentId);
      }  
    }
  };

  getChild = (item, nChild = 0 ) => {
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

  getChildren = (item) => {
    const itemIm = getItem(item);
    if (itemIm) {
      return itemIm.get('children').toJS();
    }  
  }

  getSiblings = (item, dir = 1 ) => {
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
  }

  buildTree = (item) => {
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

  getItems = () => Object.keys(this.storage)

  isRootItem = (item) => {
    const itemIm = getItem(item);
    return itemIm && !getParent(itemIm);
  }

}

export default Storage;