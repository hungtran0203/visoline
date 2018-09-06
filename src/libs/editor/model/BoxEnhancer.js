import Model from 'libs/model/model';
import BelongsTo from 'libs/model/relations/BelongsTo';
import MetaModel from 'gen/visoline/model/Meta';
import register from 'libs/model/register';
import './BoxEnhancer/configSchema';

export class BoxEnhancerModel extends Model {
  static COLNAME = 'boxEnhancer';
  constructor(...args) {
    super(...args);
    this.enhancer = new BelongsTo({ relOwner: this, relName: 'enhancerId', relClass: MetaModel });
  }
};

register.register(BoxEnhancerModel.COLNAME, BoxEnhancerModel);

export default BoxEnhancerModel;
