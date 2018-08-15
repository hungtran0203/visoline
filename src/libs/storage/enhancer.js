import Storage from './Storage';
import { Enhancer } from 'libs/enhancer';
import formatters from './formatter';
import BaseItem from './base';
import _ from 'lodash';
import uuid from 'uuid';
import { fromJS } from 'immutable';

const DOMAIN = 'enhancer';
/*
  wrapper of immutable object
*/
const storage = Storage.domain(this.domain, { storageKey: 'visoline.db.enhancers' });
export class EnhancerItem extends BaseItem {
  constructor(item) {
    super(item, DOMAIN);
    this.formatters = formatters(this.constructor);
    this.storage = storage;
    this.data = this.storage.getItem(item);
    // define additional relations
  }

  static newInstance(opts) {
    const instance = new EnhancerItem();
    instance.data = fromJS({
      ...opts,
      id: uuid(),
    });
    return instance;
  }

  static getInstance(item) {
    return new EnhancerItem(item);
  }

  static all() {
    const storage = Storage.domain(DOMAIN);
    return storage.getItems();
  }  
  
  static doSave() {
    return storage.doSave();
  }

  static doLoad() {
    return storage.doLoad();
  }
  
  getImplement = () => {
    return Enhancer.fromIm(this.data);
  }
}

export default EnhancerItem;
