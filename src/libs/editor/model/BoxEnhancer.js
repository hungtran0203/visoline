import Model from 'libs/model/model';
import Nested from 'libs/model/relations/Nested';
import HasMany from 'libs/model/relations/HasMany';
import BelongsTo from 'libs/model/relations/BelongsTo';
import _ from 'lodash';
import MetaModel from 'libs/loader/meta';

export class BoxEnhancerModel extends Model {
  static COLNAME = 'boxEnhancer';
  constructor(...args) {
    super(...args);
    this.enhancer = new BelongsTo({ relOwner: this, relName: 'enhancerId', relClass: MetaModel });
  }
};

export default BoxEnhancerModel;
