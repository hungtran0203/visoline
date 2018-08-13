import {  withProps } from 'recompose';
import storage from 'libs/storage';
import reactCSS from 'reactcss';

export const withStyleBuilder = () => withProps(({ item }) => {
  const itemIm = storage.getItem(item);
  const style = itemIm.get('style');
  if (style) {
    return {
      style: reactCSS({
        default: {
          item: style.toJS(),
        }
      }).item,
    }
  }
  return {};
});
