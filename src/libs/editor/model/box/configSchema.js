import register from 'libs/Registry';
const COLNAME = 'box';

register('MODEL_CONFIG_SCHEMA').register(COLNAME, {
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
});
