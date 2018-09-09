import register from 'libs/register';

import _ from 'lodash';

const getConfigSchema = (model) => {
  const BoxModel = register('MODEL_CLASS').get('box');
  const BoxEnhancerModel = register('MODEL_CLASS').get('boxEnhancer');
  if (model instanceof BoxModel) {
    return register('MODEL_CONFIG_SCHEMA').get(model.constructor.COLNAME);
  } else if (model instanceof BoxEnhancerModel) {
    return model.enhancer.toIt().getIn(['schema', 'config']).toJS();
  }

};

const getPropType = (model, prop) => {
  const ConfigSchema = getConfigSchema(model);
  return _.get(ConfigSchema, `${prop}.type`, 'hidden');
}

export const getRenderer = (model, prop) => {
  const defaultRender = register('CONFIG_UI').get('hidden');
  return register('CONFIG_UI').get(getPropType(model, prop)) || defaultRender
}

export const getConfigProps = (model) => {
  const ConfigSchema = getConfigSchema(model);
  return Object.keys(ConfigSchema);
}
