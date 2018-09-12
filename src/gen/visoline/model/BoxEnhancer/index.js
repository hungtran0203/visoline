import Model from 'libs/model/model';
import BelongsTo from 'gen/visoline/model/relations/BelongsTo';
import Registry from 'libs/Registry';

export class BoxEnhancerModel extends Model {
  static COLNAME = 'boxEnhancer';
  constructor(...args) {
    super(...args);
    const MetaModel = Registry('MODEL_CLASS').get('meta');

    this.enhancer = new BelongsTo({ relOwner: this, relName: 'enhancerId', relClass: MetaModel });
  }
};

// load schema
Registry('MODEL_CLASS').register(BoxEnhancerModel.COLNAME, BoxEnhancerModel);

export default BoxEnhancerModel;
