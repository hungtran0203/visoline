import Model from 'libs/model/model';
import Nested from 'gen/visoline/model/relations/Nested';
import HasMany from 'gen/visoline/model/relations/HasMany';
import _ from 'lodash';

import register from 'libs/Registry';

export class BoxModel extends Model {
  static COLNAME = 'box';
  constructor(...args) {
    super(...args);
    const BoxEnhancerModel = register('MODEL_CLASS').get('boxEnhancer');

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

// load schema
register.load(require.context('./schema', true, /.*(\.json)$/));
register('MODEL_CLASS').register(BoxModel.COLNAME, BoxModel);

export default BoxModel;
