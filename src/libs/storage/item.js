
import { Enhancer } from 'libs/enhancer';
import formatters from './formatter';
import BaseItem from './base';
import HasMany from './relations/HasMany';
import EnhancerItem from './enhancer';

/*
  wrapper of immutable object
*/
export class Item extends BaseItem {
  constructor(item) {
    super(item);
    this.formatters = formatters(this.constructor);

    // define additional relations
    this.enhancers = new HasMany({ relOrig: this, relName: 'enhancers', relClass: EnhancerItem });
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
