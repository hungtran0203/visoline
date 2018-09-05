import register from 'libs/register';
const COLNAME = 'boxEnhancer';

register('MODEL_CONFIG_SCHEMA').register(COLNAME, {
  content: { type: 'editable' },
  style: { type: 'editable' },
  children: { type: 'hidden' },
  parentId: { type: 'hidden' },
  id: { type: 'hidden' },
});
