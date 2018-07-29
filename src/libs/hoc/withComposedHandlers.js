import { withProps } from 'recompose';
import _ from 'lodash';

const toArray = (item) => {
  return Array.isArray(item) ? item : [item];
};

export const withComposedHandlers = (handlers, opts) => withProps(
  (ownerProps) => {
    const keys = _.keys(handlers);
    const composeProps = {};
    const isAsync = _.get(opts, 'async', false);
    keys.map(key => {
      const composedFns = [...toArray(handlers[key])].map(gen => gen(ownerProps));
      if (typeof ownerProps[key] === 'function') {
        composedFns.push(ownerProps[key]);
      }
      composeProps[key] = composedFns.length === 1 ?
        composedFns[0] :
        (...args) => {
          if (!!isAsync) {
            const delay = _.get(opts, 'delay', 0);
            composedFns.map((fn, index) => setTimeout(() => fn(...args), index * delay));
          } else {
            composedFns.map((fn) => fn(...args));
          }
        };
      return composeProps;
    });
    return composeProps;
  }
);
