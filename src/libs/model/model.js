import * as storage from './Storage';
import _ from 'lodash';
import { fromJS } from 'immutable';
import uuid from 'uuid';
// import formatters from './formatter';
import { FORMAT_JSON, FORMAT_IM, FORMAT_IT, FORMAT_ID} from './constants';

/*
  wrapper of immutable object
*/

const instances = new Map();

export class Model {
  static FORMAT_JSON = FORMAT_JSON;
  static FORMAT_IM = FORMAT_IM;
  static FORMAT_IT = FORMAT_IT;
  static FORMAT_ID = FORMAT_ID;

  static Model = true;

  static COLNAME = 'item';
  
  static new(...args) {
    const instance = this.getInstance(...args);
    if (!instance.getId()) {
      instance.set('id', uuid());
    }
    return instance;
  };

  static getInstance(...args) {
    const Class = this;
    const instance = new Class(...args);
    if(!instance.getId()) {
      return instance;
    }
    if (!instances.has(instance.getId())) {
      instances.set(instance.getId(), instance);
    }
    return instances.get(instance.getId());
  }

  static find(condition) {
    const found = storage.find(this.COLNAME, condition);
    if(found) {
      return this.getInstance(found);
    }
    return null;
  }

  static findAll(condition) {
    const found = storage.findAll(this.COLNAME, condition);
    if(found) {
      return found.map(item => this.getInstance(item));
    }
    return null;
  }

  static onSizeChange(listener) {
    return storage.onSizing(this.COLNAME, listener);
  }

  static size() {
    return storage.size(this.COLNAME);
  }

  constructor(item) {
    this.data = storage.getItem(this.constructor.COLNAME, item);

    if(this.data === storage.NOT_EXIST) {
      this.data = fromJS(_.isObject(item) ? item : {});
    }
    // this.formatters = formatters(this.constructor);
  }

  sync() {
    this.data = storage.getItem(this.constructor.COLNAME, this.getId());
    return this;
  }

  set(path, value) {
    this.data = this.data.set(path, value);
    return this;
  }

  setIn(path, value) {
    this.data = this.data.setIn(path, value);
    return this;
  }

  get(path, unsetVal) {
    return this.data.get(path, unsetVal);
  }

  getIn(path, unsetVal) {
    return this.data.getIn(path, unsetVal);
  }

  subscribe(listener) {
    return storage.subscribe(this.constructor.COLNAME, this.data, listener);
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
    storage.updateItem(this.constructor.COLNAME, this.data);
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

  toIt() {
    return this;
  }

  /*
    MODIFIER METHODS
  */

  delete() {
    // delete this item
    storage.deleteItem(this.constructor.COLNAME, this.toIm());
    return this;
  }
}

export default Model;

