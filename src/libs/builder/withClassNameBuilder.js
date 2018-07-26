import {  withProps } from 'recompose';
import { getItem } from 'libs/storage';
import classnames from 'classnames';

export const withClassNameBuilder = () => withProps(({ item, className }) => {
  const itemIm = getItem(item);
  return { className: classnames(className, itemIm.get('className')) };
});
