import Registry from 'libs/Registry';

import _ from 'lodash';

const getConfigSchema = (model) => {
  const BoxModel = Registry('MODEL_CLASS').get('box');

  const BoxEnhancerModel = Registry('MODEL_CLASS').get('boxEnhancer');
  if(typeof model === 'string') {
    return Registry('CONFIG_SCHEMA').get(model);
  } else if (model.constructor) {
    const modelClassId = Registry('CODE_LOOKUP').resolve(model.constructor);
    return Registry('CONFIG_SCHEMA').get(modelClassId);
  } 
  if (model instanceof BoxModel) {
    return Registry('CONFIG_SCHEMA').get(model.constructor.COLNAME);
  } else if (model instanceof BoxEnhancerModel) {
    return model.enhancer.toIt().getIn(['schema', 'config']).toJS();
  }

};

const getPropType = (model, prop) => {
  const ConfigSchema = getConfigSchema(model);
  return _.get(ConfigSchema, `${prop}.type`, 'hidden');
}

export const getRenderer = (model, prop) => {
  const defaultRender = Registry('CONFIG_UI').get('hidden');
  return Registry('CONFIG_UI').get(getPropType(model, prop)) || defaultRender
}

export const getConfigProps = (model) => {
  const ConfigSchema = getConfigSchema(model);
  return Object.keys(ConfigSchema);
}
