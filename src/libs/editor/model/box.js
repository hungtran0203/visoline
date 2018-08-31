import Model from 'libs/model/model';
import Nested from 'libs/model/relations/Nested';
import _ from 'lodash';

export class BoxModel extends Model {
  static COLNAME = 'box';
  constructor(...args) {
    super(...args);

    // define parent-children relationship
    const parentChildrenRel = new Nested({ relOwner: this, relUpperName: 'parentId', relLowerName: 'children', relClass: this.constructor });
    this.parent = parentChildrenRel.getUpperRel();
    this.children = parentChildrenRel.getLowerRel();
    this.parentChildrenRel = parentChildrenRel;
  }

  toStorage() {
    return _.omit(this.toJS(), ['directoryId']);
  }
};

export default BoxModel;
