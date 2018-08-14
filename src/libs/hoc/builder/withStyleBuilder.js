import {  compose, withProps } from 'recompose';
import reactCSS from 'reactcss';
import { withItemIm } from 'libs/hoc/builder';

export const withStyleBuilder = () => compose(
  withItemIm(),
  withProps(({ itemIm }) => {
  if(itemIm) {
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
  }
  return {};  
}));
