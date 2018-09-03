import _ from 'lodash';
import ReadOnlyRender from './components/ReadOnlyRender';
import HiddenRender from './components/HiddenRender';
import EditableRender from './components/EditableRender';
import EnhancerRender from './components/EnhancerRender';

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

const TypeMap = {
  readonly: ReadOnlyRender,
  hidden: HiddenRender,
  editable: EditableRender,
  enhancer: EnhancerRender,
}

const getPropType = (prop) => {
  return _.get(ConfigSchema, `${prop}.type`, 'hidden');
}

export const getRenderer = (prop) => {
  return _.get(TypeMap, getPropType(prop), TypeMap.hidden);
}

export const getConfigProps = () => {
  return Object.keys(ConfigSchema);
}

export default ConfigSchema;
