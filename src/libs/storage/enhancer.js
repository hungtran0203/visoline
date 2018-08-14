import Storage from './Storage';
import { Enhancer } from 'libs/enhancer';
import formatters from './formatter';
import BaseItem from './base';
import _ from 'lodash';
const DOMAIN = 'enhancer';
/*
  wrapper of immutable object
*/
export class EnhancerItem extends BaseItem {
  constructor(item) {
    super(item);
    this.formatters = formatters(this.constructor);
    this.domain = DOMAIN;
    this.storage = Storage.domain(this.domain, { storageKey: 'visoline.db.enhancers' });
    // define additional relations
  }

  static getInstance(item) {
    return new EnhancerItem(item);
  }

  static all() {
    const storage = Storage.domain(DOMAIN);
    return storage.getItems();
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
      default:
        return null;
    }
  }
}

export default EnhancerItem;
