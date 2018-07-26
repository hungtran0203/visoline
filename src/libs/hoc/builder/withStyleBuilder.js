import {  withProps } from 'recompose';
import { getItem } from 'libs/storage';

export const withStyleBuilder = () => withProps(({ item }) => {
  const itemIm = getItem(item);
  const style = itemIm.get('style');
  return { style: style ? style.toJS() : style };
});
