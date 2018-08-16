import _ from 'lodash';
import Enhancer from './base';
import * as lookups from './index';

const checkSubclass = (B, A) => {
  return typeof B === 'function' && B.prototype instanceof A || B === A;
};

export const enhancerCreator = (config) => {
  const enhancerName = _.get(config, 'name');
  // lookup enhancerFunction from name
  const enhancer = lookups[enhancerName];
  if (checkSubclass(enhancer, Enhancer)) {
    const En = enhancer;
    const builder = new En(config);
    return builder.build();
  }
  return null;
};

