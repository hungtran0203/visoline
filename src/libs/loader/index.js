import _ from 'lodash';
import { fromJS, Set } from 'immutable';
import path from 'path';
import uuid from 'uuid';
import DirectoryModel from 'gen/visoline/model/Directory';
import MetaModel from 'gen/visoline/model/Meta';
import register from 'libs/Registry';
import * as layerProcessors from './processor';

const requireAll = require.context('../../gen', true, /.*(\.js)$/);
const requireAllMeta = require.context('../../gen', true, /.*(meta\.json)$/);
const requireAllYaml = require.context('../../gen', true, /.*(meta\.yaml)$/);
const allSourceFiles = requireAll.keys();

const DEFAULT_TYPE = 'item';
const typeSymbols = new Map();
const getTypeSymbol = (type) => {
  if (!typeSymbols.has(type)) {
    typeSymbols.set(type, Symbol(type));
  }
  return typeSymbols.get(type);
};

let directoryStore = fromJS({}).asMutable();

// const metaLoader = (filename) => {
//   const dirname = path.dirname(filename);

//   // load meta file
//   // const metaFilename = `./${path.join(dirname, 'meta.json')}`;
//   const metaConfig = requireAllMeta(filename);
//   metaConfig.map((meta) => {
//     const paths = path.join(dirname).split(path.sep);
//     const node = DirectoryModel.mkdirp(paths);
//     const metaIt = MetaModel.getInstance(meta);
//     metaIt.directory.changeTo(node.getId());
//     metaIt.save();
//     node.meta.addUnique(metaIt);
//     // load content
//     const entryFile = _.get(meta, 'entry', 'index');
//     const entryFullFilename = './' + path.join(dirname, `${entryFile}.js`);
//     if(allSourceFiles.includes(entryFullFilename)) {
//       const req = requireAll(entryFullFilename);
//       const exp = _.get(meta, 'export', 'default');
//       const { id, type } = meta;
//       register(type).register(id, _.get(req, exp));
//     }
//     node.save();
//   });
// }

// requireAllMeta.keys().forEach((filename, index, files) => {
//   metaLoader(filename, files);
// });


const processLayer = (props) => (layerId, data) => {
  const layerData = _.get(data, layerId);
  const layerProcessor = _.get(layerProcessors, layerId);
  if(typeof layerProcessor === 'function') {
    layerProcessor(props)(layerData, data);
  }
}

const yamlMetaLoader = (filename) => {
  const data = requireAllYaml(filename);
  const props = { filename };
  _.union(_.keys(data), _.keys(layerProcessors))
    .map(layerId => processLayer(props)(layerId, data));
}

requireAllYaml.keys().forEach((filename) => {
  yamlMetaLoader(filename);
});

export const addType = (name, ns, typeStr = DEFAULT_TYPE) => {
  const uid = uuid();
  const type = getTypeSymbol(typeStr);
  const value = directoryStore.getIn([...ns, type], Set()).add(uid);
  directoryStore = directoryStore.setIn([...ns, type], value);  
  return directoryStore.asImmutable();
};
