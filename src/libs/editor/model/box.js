import Model from 'libs/model/model';
import Nested from 'libs/model/relations/Nested';
import HasMany from 'libs/model/relations/HasMany';
import _ from 'lodash';
import BoxEnhancerModel from './BoxEnhancer';
import './box/configSchema';

import register from 'libs/model/register';

export class BoxModel extends Model {
  static COLNAME = 'box';
  constructor(...args) {
    super(...args);

    // define parent-children relationship
    const parentChildrenRel = new Nested({ relOwner: this, relUpperName: 'parentId', relLowerName: 'children', relClass: this.constructor });
    this.parent = parentChildrenRel.getUpperRel();
    this.children = parentChildrenRel.getLowerRel();
    this.parentChildrenRel = parentChildrenRel;

    this.enhancers = new HasMany({ relOwner: this, relName: 'enhancers', relClass: BoxEnhancerModel });
  }

  toStorage() {
    return _.omit(this.toJS(), ['directoryId']);
  }
};

register.register(BoxModel.COLNAME, BoxModel);

export default BoxModel;
