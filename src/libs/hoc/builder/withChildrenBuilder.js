import { List } from 'immutable';
import _ from 'lodash';
import {  compose, withProps } from 'recompose';
import { getItem } from 'libs/storage';
import { getItemBuilder } from './getItemBuilder';
import { omitProps } from 'libs/hoc';

export const withChildrenBuilder = () => compose(
  getItemBuilder(),
  withProps(({ item, itemBuilder }) => {
    const itemIm = getItem(item);
    const children = itemIm.get('children');
    if (!List.isList(children)) return { children: null };
    return { 
      children: children.toJS().map((itemId) => itemBuilder({ key: itemId })(itemId)),
    };
  }),
  omitProps(['itemBuilder']),
);