import register from 'libs/register';

import _ from 'lodash';

const getConfigSchema = (model) => register('MODEL_CONFIG_SCHEMA').get(model.constructor.COLNAME);
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
