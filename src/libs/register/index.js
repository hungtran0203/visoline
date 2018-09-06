
import _ from 'lodash';

const UUID_LENGTH = 36;

const lookup = new Map();
class Register {
  constructor() {
    this.Components = {};
  }

  get(type) {
    return _.get(this.Components, type);
  }

  register(type, Class) {
    _.set(this.Components, type, Class);
    return this;
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

export const register = (ns) => {
  if (!lookup.has(ns)) {
    lookup.set(ns, new Register());
  }
  return lookup.get(ns);
}

register.load = (requireAll) => {
  requireAll.keys().forEach((filename) => {
    const req = requireAll(filename);
    // json loader
    const namespace = _.get(req, 'namespace');
    const name = _.get(req, 'name');
    const schema = _.get(req, 'schema');
    register(namespace).register(name, schema);
  });
  
}

export default register;
