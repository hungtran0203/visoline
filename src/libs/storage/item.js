import * as storage from 'libs/storage';
import { Enhancer } from 'libs/enhancer';
import _ from 'lodash';
import * as formatters from './format';

/*
  wrapper of immutable object
*/
export class Item {
  static FORMAT_JSON = 'json';
  static FORMAT_IM = 'im';
  static FORMAT_IT = 'it';
  static FORMAT_ID = 'id';

  constructor(item) {
    this.data = storage.getItem(item);
  }

  set(path, value) {
    this.data = this.data.set(path, value);
    return this;
  }

  get(path, unsetVal) {
    return this.data.get(path, unsetVal);
  }

  subscribe(listener) {
    return storage.subscribe(this.data)(listener);
  };  

  has(path) {
    return this.isExists() && this.data.has(path);
  }

  getOneOf(paths, unsetVal) {
    for( let i = 0; i < paths.length; i = i + 1) {
      if (this.has(paths[i])) {
        return this.get(paths[i])
      }
    }
    return unsetVal;
  }

  save() {
    storage.updateItem(this.data);
    return this;
  }

  isExists() {
    return !!this.data;
  }
  /*
    read method
  */
  getData() {
    return this.data;
  }
  getId() {
    return this.get('id');
  }

  toIm() {
    return this.data;
  }

  toJS() {
    return this.data.toJS();
  }

  getChildIndex() {
    const parentIt = this.getParent(Item.FORMAT_IT);
    if (parentIt) {
      const childrenIm = parentIt.getChildren();
      if (childrenIm) {
        const index = childrenIm.indexOf(this.getId());
        return index;
      }
    }
  }

  getParentId() {
    return this.get('parentId');
  }

  getParent(format=Item.FORMAT_IM) {
    const parentId = this.getParentId();
    if (parentId) {
      const parentIt = new Item(parentId);
      return formatters.formatIt(parentIt, format);
    }
    return null;
  }

  getChildren(format=Item.FORMAT_IM) {
    const childrenIm = this.get('children');
    return formatters.formatImCollection(childrenIm, format);
  }

  getSiblings(dir = 1, format=Item.FORMAT_JSON) {
    const parentIt = this.getParent(Item.FORMAT_IT);
    let siblings = [];
    if (parentIt) {
      const childrenIm = parentIt.getChildren();
      if (childrenIm) {
        const index = this.getChildIndex();
        if (index >= 0) {
          const range = dir > 0 ? [ index + 1, index + dir + 1 ] : [ index + dir, index ];
          siblings = childrenIm.slice(...range);
          return formatters.formatImCollection(siblings, format);
        }
      }  
    }
    return siblings;
  };
  
  getEnhancers(format='object') {
    const enhancers = this.get('enhancers');
    switch(format) {
      case 'im':
        return enhancers;
      case 'object':
        return _.compact(enhancers.map(enh => {
          return Enhancer.fromIm(enh);
        }).toJS());
      default:
        return null;
    }
  }

  getPath(key=['name', 'id'], sep = '.') {
    let curr = this;
    const paths = [this.getOneOf(key)];
    let parent;
    while((parent = curr.getParent()) && parent.isExists()) {
      paths.push(parent.getOneOf(key));
      curr = parent;
    }
    return paths.reverse().join(sep);
  }

  /*
    MODIFIER METHODS
  */

  insertChild(child) {
    const childIt = new Item(child);
    childIt.set('parentId', this.getId()).save();
    const childrenIm = this.getChildren().push(childIt.getId());
    this.set('children', childrenIm).save();
    return this;
  }

  removeChild(child) {
    const childIt = new Item(child);
    if (childIt.isExists() && childIt.getParentId() === this.getId()) {
      const childIndex = childIt.getChildIndex();
      const childrenIm = this.getChildren().remove(childIndex);
      this.set('children', childrenIm).save();
    }
  }

  changeParent(newParentId) {
    storage.transactionStart();
    const oldParentIt = this.getParent(Item.FORMAT_IT);
    if (oldParentIt) {
      const childrenIm = oldParentIt.getChildren();
      if (childrenIm) {
        const index = this.getChildIndex();
        const newChildrenIm = childrenIm.delete(index);
        oldParentIt.set('children', newChildrenIm);
        oldParentIt.save();
      }
    }
    this.set('parentId', newParentId);
    this.save();
    if(newParentId) {
      const newParentIt = new Item(newParentId);
      if (newParentIt.isExists()) {
        const newChildrenIm = newParentIt.getChildren().push(this.getId());
        newParentIt.set('children', newChildrenIm);
        newParentIt.save();
      }
    }
    storage.transactionEnd();
    return this;
  }

  moveUp(distance=1) {
    const parentIt = this.getParent(Item.FORMAT_IT);
    if (parentIt) {
      const childrenIm = parentIt.getChildren();
      if (childrenIm) {
        const index = this.getChildIndex();
        const newIndex = index + distance;
        const newChildrenIm = childrenIm.delete(index).insert(newIndex, this.getId());
        parentIt.set('children', newChildrenIm);
        parentIt.save();
      }
    }
    return this;
  }

  moveDown(distance=1) {
    const parentIt = this.getParent(Item.FORMAT_IT);
    if (parentIt) {
      const childrenIm = parentIt.getChildren();
      if (childrenIm) {
        const index = this.getChildIndex();
        const newIndex = index - distance;
        const newChildrenIm = childrenIm.delete(index).insert((newIndex < 0 ? 0 : newIndex), this.getId());
        parentIt.set('children', newChildrenIm);
        parentIt.save();
      }  
    }
    return this;
  }

  delete(rec=true) {
    storage.transactionStart();
    // update parent
    this.changeParent(null);
    // delete children
    if(rec) {
      const childrenIt = this.getChildren(Item.FORMAT_IT);
      if(childrenIt) {
        childrenIt.map(childIt => childIt.delete(rec));
      }
    }
    // delete this item
    storage.deleteItem(this.toIm());
    storage.transactionEnd();
    return this;
  }
}
