import _ from 'lodash';
import { fromJS, Set } from 'immutable';
import path from 'path';

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

const store = fromJS({}).asMutable();
const directoryStore = fromJS({}).asMutable();

const loader = (filename, files) => {
  const dirname = path.dirname(filename);
  const basename = path.basename(filename);

  // load meta file
  const metaFilename = `./${path.join(dirname, 'meta.json')}`;
  if (files.includes(metaFilename)) {
    const metaConfig = requireAll(metaFilename);
    metaConfig.map((meta) => {
      const uid = _.get(meta, 'uid');
      if (!store.has(uid)) {
        store.set(uid, fromJS(meta));
      }
  
      // load ns
      const ns = path.join(dirname).split(path.sep);
      store.setIn([uid, 'ns'], ns.join('.'));
  
      // config ns
      const type = getTypeSymbol(_.get(meta, 'type', DEFAULT_TYPE));
      const value = directoryStore.getIn([...ns, type], Set()).add(uid);
      directoryStore.setIn([...ns, type], value);
  
      // load content
      const req = requireAll(filename);
      Object.keys(req).map(key => {
        if (key === 'default') {
          store.setIn([uid, 'handler'], req[key])
        }
      })
    })
  }

}

requireAll.keys().forEach((filename, index, files) => {
  const paths = _.compact(_.split(_.trim(filename, '.'), '/'));
  const req = requireAll(filename);
  loader(filename, files);
});

export const getDirectory = () => directoryStore.asImmutable();
export const getLoaderStore = () => store.asImmutable();

export default getDirectory;
