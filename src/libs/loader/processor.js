import _ from 'lodash';
import path from 'path';
import DirectoryModel from 'gen/visoline/model/Directory';
import MetaModel from 'gen/visoline/model/Meta';
import Registry from 'libs/Registry';

const requireAll = require.context('../../gen', true, /.*(\.js)$/);
const allSourceFiles = requireAll.keys();

const directive = (reqProps, supProps) => (handler) => {
  return handler;
};

export const LAYER_DEFAULT = directive(['filename'])((props) => (layerData) => {
  /** data require at this layer */
  const filename = _.get(props, 'filename');
  /** data require at this layer */

  const dirname = path.dirname(filename);
  const paths = path.join(dirname).split(path.sep);
  const id = _.get(layerData);
  const node = DirectoryModel.mkdirp(paths);
  const metaIt = MetaModel.getInstance(id);
  metaIt.directory.changeTo(node.getId());
  metaIt.save();
  node.meta.addUnique(metaIt);
  node.save();

  /** data provide at this layer */
  _.set(props, 'id', id);
  /** data provide at this layer */
});

export const LAYER_CONTENT_LOADER = directive(['filename', 'id', 'type'])((props) => (layerData) => {
  /** data require at this layer */
  const filename = _.get(props, 'filename');
  /** data require at this layer */
  const dirname = path.dirname(filename);
  const entryFile = _.get(layerData, 'entry', 'index');
  const entryFullFilename = './' + path.join(dirname, `${entryFile}.js`);
  if(allSourceFiles.includes(entryFullFilename)) {
    const req = requireAll(entryFullFilename);
    const exp = _.get(layerData, 'export', 'default');

    const { id, type } = _.pick(props, ['id', 'type']);
    Registry(type).register(id, _.get(req, exp));
  }

  /** data provide at this layer */
});

export const LAYER_RAW_DATA = directive(['id'])((props) => (layerData, data) => {
  const id = _.set(props, 'id');
  const type = 'LAYER_RAW_DATA';
  Registry(type).register(id, data);
});
