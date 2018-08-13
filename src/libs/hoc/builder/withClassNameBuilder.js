import {  withProps } from 'recompose';
import storage from 'libs/storage';
import classnames from 'classnames';

export const withClassNameBuilder = () => withProps(({ item, className }) => {
  const itemIm = storage.getItem(item);
  return { className: classnames(className, itemIm.get('className')) };
});
