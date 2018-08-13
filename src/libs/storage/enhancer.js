import Storage from './Storage';
import { Enhancer } from 'libs/enhancer';
import formatters from './formatter';
import BaseItem from './base';

/*
  wrapper of immutable object
*/
export class Enhancer extends BaseItem {
  constructor(item) {
    super(item);
    this.formatters = formatters(this.constructor);
    this.domain = 'enhancer';
    this.storage = Storage.domain(this.domain);
    // define additional relations
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
