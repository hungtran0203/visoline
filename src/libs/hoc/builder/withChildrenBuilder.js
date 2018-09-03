import { List } from 'immutable';
import {  compose, withProps } from 'recompose';
import { getItemBuilder } from './getItemBuilder';
import { omitProps } from 'libs/hoc';
import { withItemIt } from 'libs/hoc/builder';

export const withChildrenBuilder = () => compose(
  withItemIt(),
  getItemBuilder(),
  withProps(({ itemIt, itemBuilder }) => {
    if(itemIt.isExists()) {
      if(itemIt.has('content')) {
        return { children: itemIt.get('content') };
      }
      const children = itemIt.children.toIm();
      if (!List.isList(children)) return { children: null };
      return { 
        children: children.toJS().map((itemId) => itemBuilder({ key: itemId })(itemId)),
      };  
    }
    return { children: null };
  }),
  omitProps(['itemBuilder']),
);
