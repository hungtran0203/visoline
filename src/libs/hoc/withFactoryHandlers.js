import { withProps } from 'recompose';
import _ from 'lodash';

export const withFactoryHandlers = (handlers) => BaseComponent => {
  const factory = _.memoize((handler) => _.memoize((...args) => (...eArgs) => handler(...args, ...eArgs), (...args) => JSON.stringify(args)));
  const propsCreator = (ownerProps) => {
    const props = {};
    const propsList = _.get(handlers, 'length') ? handlers : Object.keys(handlers);
    propsList.map(prop => {
      const handler = ownerProps[prop];
      const factoryFn = factory(handler);
      const propName = (typeof handlers[prop] === 'function' ? handlers[prop](ownerProps) : handlers[prop]) || prop;
      props[propName] = factoryFn;
      return prop;
    });
    return props;
  };
  return withProps(propsCreator)(BaseComponent);
};

export default withFactoryHandlers;
