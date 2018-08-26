import _ from 'lodash';
import { fromJS, Set } from 'immutable';
import path from 'path';
import uuid from 'uuid';

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

let store = fromJS({}).asMutable();
let directoryStore = fromJS({}).asMutable();

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
          store.setIn([uid, getTypeSymbol('handler')], req[key])
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

export const addType = (name, ns, typeStr = DEFAULT_TYPE) => {
  const uid = uuid();
  const type = getTypeSymbol(typeStr);
  const value = directoryStore.getIn([...ns, type], Set()).add(uid);
  directoryStore = directoryStore.setIn([...ns, type], value);  
  store = store.set(uid, fromJS({ uid, type: typeStr, name, entry: name, ns: ns.join('.') }));
  return directoryStore.asImmutable();
};

const cleanMetaObject = (metaObj) => {
  return _.pickBy(metaObj, (value, key) => {
    return typeof key !== 'symbol' && typeof value !== 'symbol' && !['ns'].includes(key);
  })
}

export const getMetaObject = (ns) => {
  const node = directoryStore.getIn(ns);
  const metaObj = [];
  node.map((val, key) => {
    if(typeof key === 'symbol') {
      val.map(uid => {
        const item = store.get(uid);
        if (item) {
          metaObj.push(cleanMetaObject(item.toJS()));
        }
      })
    }
  });
  return metaObj;
};

export default getDirectory;
