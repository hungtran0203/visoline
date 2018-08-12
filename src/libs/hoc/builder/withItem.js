import { compose, branch, withProps, renderNothing } from 'recompose';
import * as storage from 'libs/storage';
import { Enhancer } from 'libs/enhancer';
import _ from 'lodash';

/*
  wrapper of immutablet object
*/
class Item {
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
  getParentId() {
    return this.get('parentId');
  }

  getParent() {
    const parentId = this.getParentId();
    if (parentId) {
      return new Item(parentId);
    }
    return null;
  }

  getEnhancers(format='object') {
    const enhancers = this.get('enhancers');
    switch(format) {
      case 'im':
        return enhancers;
      case 'object':
        return _.compact(enhancers.map(enh => {
          return Enhancer.fromIm(enh);
        }).toJS());
    }
    return null;
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
}

export const withItemIm = (mapItemImToPropName = 'itemIm', itemPropName='item' ) => compose(
  withProps((props) => ({ [mapItemImToPropName]: new Item(props[itemPropName]) })),
);
