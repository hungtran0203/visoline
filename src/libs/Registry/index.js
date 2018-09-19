
import _ from 'lodash';
import { register } from '../register/index';

const UUID_LENGTH = 36;

const lookup = new Map();
class Registry {
  constructor(ns) {
    this.ns = ns;
    this.Components = new Map();
  }

  has(type) {
    return this.Components.has(type);
  }

  get(type) {
    return this.Components.get(type);
  }

  resolve(type) {
    return this.get(type);
  }

  getRefId(id) {
    return `${id}@${this.ns}`;
  }

  register(type, Class) {
    this.Components.set(type, Class);
    return this;
  }

  set(type, Class) {
    return this.register(type, Class);
  }

  resolveById(id, Class) {
    let uid = '';
    let type = _.get(Class, 'type');
    let ClassFn = Class;
    if (typeof id === 'string') {
      if (id.length === UUID_LENGTH) {
        uid = id;
      } else if (id[UUID_LENGTH] === '@') {
        uid = id.slice(0, UUID_LENGTH);
        type = id.slice(UUID_LENGTH + 1);
        ClassFn = this.get(type);
      }

      if (uid && ClassFn) {
        if (ClassFn && typeof ClassFn.getInstance === 'function') {
          return ClassFn.getInstance(uid);
        }
      }
    } else if (typeof id === 'object') {
      return id;
    }
  }
}

export const registry = (ns) => {
  if (!lookup.has(ns)) {
    lookup.set(ns, new Registry(ns));
  }
  return lookup.get(ns);
};

registry.load = (requireAll) => {
  requireAll.keys().forEach((filename) => {
    const req = requireAll(filename);
    // json loader
    const namespace = _.get(req, 'namespace');
    const name = _.get(req, 'name');
    const schema = _.get(req, 'schema');
    registry(namespace).register(name, schema);
  });
}


const typeLookup = new Map();
registry.setLookup = (id, type) => {
  typeLookup.set(id, type);
}

registry.lookup = (id) => {
  const type = typeLookup.get(id);
  return [type, id];
}

registry.lookupMeta = (id) => {
  const identifier = registry.lookup(id);
  if (identifier) {
    const [ type ] = identifier;
    return register(type).get(id);
  }
}

const contentFormatter = ({ type, name, id }) => {
  switch(type) {
    case 'CONSTANT_CLASS':
      return registry('CONSTANT_CLASS').get(id);
    default:
      return registry(type).get(id);
  }
}

registry.refValueToString = (value, formatter = contentFormatter) => {
  if(typeof value === 'string' && value[0] === '@') {
    const id = value.slice(1);
    const [type] = registry.lookup(id);
    if (registry('NAME_LOOKUP').has(id)) {
      return formatter({ type, name: registry('NAME_LOOKUP').get(id), id });
    }
  }
  return value;
}

export default registry;
