import {  withProps, compose } from 'recompose';
import classnames from 'classnames';
import { withItemIm } from 'libs/hoc/builder';

export const withClassNameBuilder = () => compose(
  withItemIm(),
  withProps(({ itemIm, className }) => {
    if(itemIm) {
      return { className: classnames(className, itemIm.get('className')) };
    }
    return {};
  }),
);
