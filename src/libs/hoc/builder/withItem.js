import { compose, withProps, branch, renderNothing } from 'recompose';
import Item from 'libs/storage/item';
import _ from 'lodash';

export const withItemIm = (mapItemImToPropName = 'itemIm', itemPropName='item' ) => compose(
  withProps((props) => {
    if (!_.has(props, mapItemImToPropName)) {
      return { [mapItemImToPropName]: (new Item(props[itemPropName])).toIm() };
    }
  }),
);

export const withItemIt = (mapItemImToPropName = 'itemIt', itemPropName='item' ) => compose(
  withProps((props) => {
    if (!_.has(props, mapItemImToPropName)) {
      return { [mapItemImToPropName]: new Item(props[itemPropName]) };
    }
  }),
);

export const withItemImOrNothing = compose(
  withItemIm(),
  branch(({ itemIm }) => !itemIm, renderNothing),
);

export const withItemItOrNothing = compose(
  withItemIt(),
  branch(({ itemIt }) => !itemIt.getId(), renderNothing),
);
