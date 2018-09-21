import { List } from 'immutable';
import {  compose, withProps } from 'recompose';
import { getItemBuilder } from './getItemBuilder';
import { omitProps } from 'libs/hoc';
import { withItemIt } from 'libs/hoc/builder';

export const withChildrenBuilder = () => compose(
  withItemIt(),
  getItemBuilder(),
  withProps((props) => {
    const { itemIt, itemBuilder, childrenBuilder2 } = props;
    if(itemIt.isExists()) {
      const children = itemIt.children.toIm();
      if(itemIt.has('content')) {
        return { children: itemIt.get('content') };
      }  
      if (!List.isList(children)) {
        return { children: null };
      }
      if(typeof childrenBuilder2 === 'function') {
        console.log('childrenBuilderchildrenBuilder', childrenBuilder2);
        return { children: childrenBuilder2(props)(children) };
      }
      return { 
        children: children.toJS().map((itemId) => itemBuilder({ key: itemId })(itemId)),
      };  
    }
    return { children: null };
  }),
  omitProps(['itemBuilder']),
);
