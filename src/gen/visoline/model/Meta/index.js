import Model from 'libs/model/model';
import BelongsTo from 'gen/visoline/model/relations/BelongsTo';
import _ from 'lodash';
import Registry from 'libs/Registry';

export class MetaModel extends Model {
  static COLNAME = 'meta';
  constructor(...args) {
    super(...args);
    const DirectoryModel = Registry('MODEL_CLASS').get('directory');

    // define directory relationship
    this.directory = new BelongsTo({ relOwner: this, relName: 'directoryId', relClass: DirectoryModel });
  }

  toStorage() {
    return _.omit(this.toJS(), ['directoryId']);
  }

  getPath(sep='.') {
    const dir = this.directory.toIt();
    const nsArr = dir.getPaths().map(dir => dir.get('name'));
    return nsArr.join(sep);
  }
};

Registry('MODEL_CLASS').register(MetaModel.COLNAME, MetaModel);

export default MetaModel;
