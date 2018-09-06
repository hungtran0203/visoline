import Model from 'libs/model/model';
import BelongsTo from 'libs/model/relations/BelongsTo';
import register from 'libs/register';

export class BoxEnhancerModel extends Model {
  static COLNAME = 'boxEnhancer';
  constructor(...args) {
    super(...args);
    const MetaModel = register('MODEL_CLASS').get('meta');

    this.enhancer = new BelongsTo({ relOwner: this, relName: 'enhancerId', relClass: MetaModel });
  }
};

// load schema
register.load(require.context('./schema', true, /.*(\.json)$/));
register('MODEL_CLASS').register(BoxEnhancerModel.COLNAME, BoxEnhancerModel);

export default BoxEnhancerModel;
