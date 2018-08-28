import _ from 'lodash';
import { fromJS, Set } from 'immutable';
import path from 'path';
import uuid from 'uuid';
import DirectoryModel from './model';
import MetaModel from './meta';

const requireAll = require.context('../../gen', true, /.*(\.js|meta\.json)$/);
const selectors = {};

const DEFAULT_TYPE = 'item';
const typeSymbols = new Map();
const getTypeSymbol = (type) => {
  if (!typeSymbols.has(type)) {
    typeSymbols.set(type, Symbol(type));
  }
  return typeSymbols.get(type);
};

let directoryStore = fromJS({}).asMutable();

const loader = (filename, files) => {
  const dirname = path.dirname(filename);
  const basename = path.basename(filename);

  // load meta file
  const metaFilename = `./${path.join(dirname, 'meta.json')}`;
  if (files.includes(metaFilename)) {
    const metaConfig = requireAll(metaFilename);
    metaConfig.map((meta) => {
      const paths = path.join(dirname).split(path.sep);
      const node = DirectoryModel.mkdirp(paths);
      const metaIt = MetaModel.getInstance(meta);
      metaIt.directory.changeTo(node.getId());
      metaIt.save();
      node.meta.addUnique(metaIt);
    
      // // load content
      // const req = requireAll(filename);
      // Object.keys(req).map(key => {
      //   if (key === 'default') {
      //     node.setIn([uid, getTypeSymbol('handler')], req[key])
      //   }
      // });
      node.save();
    });
  }
}

requireAll.keys().forEach((filename, index, files) => {
  const paths = _.compact(_.split(_.trim(filename, '.'), '/'));
  const req = requireAll(filename);
  loader(filename, files);
});

export const addType = (name, ns, typeStr = DEFAULT_TYPE) => {
  const uid = uuid();
  const type = getTypeSymbol(typeStr);
  const value = directoryStore.getIn([...ns, type], Set()).add(uid);
  directoryStore = directoryStore.setIn([...ns, type], value);  
  const node = DirectoryModel.getInstance(uid);
  // directoryStore = store.set(uid, fromJS({ uid, type: typeStr, name, entry: name, ns: ns.join('.') }));
  return directoryStore.asImmutable();
};
