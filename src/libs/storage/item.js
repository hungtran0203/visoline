
import { Enhancer } from 'libs/enhancer';
import formatters from './formatter';
import BaseItem from './base';
import HasMany from './relations/HasMany';
import Nested from './relations/Nested';
import EnhancerItem from './enhancer';
import _ from 'lodash';
import { fromJS } from 'immutable';
import uuid from 'uuid';
import classnames from 'classnames';

const initBox = ({ parentId }) => {
  return fromJS({
    id: uuid(),
    name: parentId ? 'Item' : 'Page',
    parentId,
    type: 'Box',
    className: classnames('defaultBox'),
    children: [],
  });
};

/*
  wrapper of immutable object
*/
export class Item extends BaseItem {
  static newInstance(opts) {
    const newBox = initBox({ ...opts, parentId: null });
    const instance = new Item(newBox);
    return instance;
  }

  static getInstance(item) {
    return new Item(item);
  }

  constructor(item) {
    super(item);
    this.formatters = formatters(this.constructor);

    // define additional relations
    this.enhancers = new HasMany({ relOrig: this, relName: 'enhancers', relClass: EnhancerItem });

    const parentChildrenRel = new Nested({ relOrig: this, relUpperName: 'parent', relLowerName: 'children', relClass: Item });
    this.parent = parentChildrenRel.getUpperRel();
    this.children = parentChildrenRel.getLowerRel();
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

export default Item;