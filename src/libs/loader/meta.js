import Model from 'libs/model/model';
import { BelongsTo } from '../model/relations/BelongsTo';
import _ from 'lodash';
import DirectoryModel from './model';
import register from 'libs/model/register';

export class MetaModel extends Model {
  static COLNAME = 'meta';
  constructor(...args) {
    super(...args);

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

register.register(MetaModel.COLNAME, MetaModel);

export default MetaModel;
