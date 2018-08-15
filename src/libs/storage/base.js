import Storage from './Storage';
import _ from 'lodash';
import formatters from './formatter';
import { FORMAT_JSON, FORMAT_IM, FORMAT_IT, FORMAT_ID} from './constants';

/*
  wrapper of immutable object
*/
export class BaseItem {
  static FORMAT_JSON = FORMAT_JSON;
  static FORMAT_IM = FORMAT_IM;
  static FORMAT_IT = FORMAT_IT;
  static FORMAT_ID = FORMAT_ID;
  
  constructor(item, domain) {
    this.domain = domain || 'item';
    this.storage = Storage.domain(this.domain);
    this.data = this.storage.getItem(item);
    this.formatters = formatters(this.constructor);
  }

  set(path, value) {
    this.data = this.data.set(path, value);
    return this;
  }

  get(path, unsetVal) {
    return this.data.get(path, unsetVal);
  }

  subscribe(listener) {
    return this.storage.subscribe(this.data)(listener);
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
    this.storage.updateItem(this.data);
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
    const parentIt = this.getParent(FORMAT_IT);
    if (parentIt) {
      const childrenIm = parentIt.children.toIm();
      if (childrenIm) {
        const index = childrenIm.indexOf(this.getId());
        return index;
      }
    }
  }

  getParentId() {
    return this.get('parentId');
  }

  getParent(format=FORMAT_IM) {
    const parentId = this.getParentId();
    const Item = this.constructor;
    if (parentId) {
      const parentIt = new Item(parentId);
      return this.formatters.formatIt(parentIt, format);
    }
    return null;
  }

  getSiblings(dir = 1, format=FORMAT_JSON) {
    const parentIt = this.getParent(FORMAT_IT);
    let siblings = [];
    if (parentIt) {
      const childrenIm = parentIt.children.toIm();
      if (childrenIm) {
        const index = this.getChildIndex();
        if (index >= 0) {
          const range = dir > 0 ? [ index + 1, index + dir + 1 ] : [ index + dir, index ];
          siblings = childrenIm.slice(...range);
          return this.formatters.formatImCollection(siblings, format);
        }
      }  
    }
    return siblings;
  };
  
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
    const Item = this.constructor;
    const childIt = new Item(child);
    childIt.set('parentId', this.getId()).save();
    const childrenIm = this.children.toIm().push(childIt.getId());
    this.set('children', childrenIm).save();
    return this;
  }

  removeChild(child) {
    const Item = this.constructor;
    const childIt = new Item(child);
    if (childIt.isExists() && childIt.getParentId() === this.getId()) {
      const childIndex = childIt.getChildIndex();
      const childrenIm = this.children.toIm().remove(childIndex);
      this.set('children', childrenIm).save();
    }
  }

  changeParent(newParentId) {
    const Item = this.constructor;
    this.storage.transactionStart();
    const oldParentIt = this.getParent(FORMAT_IT);
    if (oldParentIt) {
      const childrenIm = oldParentIt.children.toIm();
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
        const newChildrenIm = newParentIt.children.toIm().push(this.getId());
        newParentIt.set('children', newChildrenIm);
        newParentIt.save();
      }
    }
    this.storage.transactionEnd();
    return this;
  }

  moveUp(distance=1) {
    const parentIt = this.getParent(FORMAT_IT);
    if (parentIt) {
      const childrenIm = parentIt.children.toIm();
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
    const parentIt = this.getParent(FORMAT_IT);
    if (parentIt) {
      const childrenIm = parentIt.children.toIm();
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
    this.storage.transactionStart();
    // update parent
    this.changeParent(null);
    // delete children
    if(rec) {
      const childrenIt = this.children.toIt();
      if(childrenIt) {
        childrenIt.map(childIt => childIt.delete(rec));
      }
    }
    // delete this item
    this.storage.deleteItem(this.toIm());
    this.storage.transactionEnd();
    return this;
  }
}

export default BaseItem;
