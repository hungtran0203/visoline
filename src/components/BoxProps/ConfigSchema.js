import register from 'libs/register';

import _ from 'lodash';

const ConfigSchema = {
  type: { type: 'editable' },
  name: { type: 'editable' },
  content: { type: 'editable' },
  className: { type: 'editable' },
  enhancers: { type: 'enhancer' },
  style: { type: 'editable' },
  directoryId: { type: 'hidden' },
  children: { type: 'hidden' },
  parentId: { type: 'hidden' },
  id: { type: 'hidden' },
};

const getPropType = (prop) => {
  return _.get(ConfigSchema, `${prop}.type`, 'hidden');
}

export const getRenderer = (prop) => {
  const defaultRender = register('CONFIG_UI').get('hidden');
  return register('CONFIG_UI').get(getPropType(prop)) || defaultRender
}

export const getConfigProps = () => {
  return Object.keys(ConfigSchema);
}

export default ConfigSchema;
