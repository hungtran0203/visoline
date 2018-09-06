import { compose, withProps, branch, renderNothing } from 'recompose';
// import Item from 'libs/storage/item';
import _ from 'lodash';
import BoxModel from 'gen/visoline/model/Box';

export const withItemIm = (mapItemImToPropName = 'itemIm', itemPropName='item' ) => compose(
  withProps((props) => {
    if (!_.has(props, mapItemImToPropName)) {
      if(_.get(props[itemPropName], 'constructor.Model')) {
        return { [mapItemImToPropName]: props[itemPropName].toIm() };
      }
      return { [mapItemImToPropName]: (BoxModel.getInstance(props[itemPropName])).toIm() };
    }
  }),
);

export const withItemIt = (mapItemImToPropName = 'itemIt', itemPropName='item' ) => compose(
  withProps((props) => {
    if (!_.has(props, mapItemImToPropName)) {
      if(_.get(props[itemPropName], 'constructor.Model')) {
        return { [mapItemImToPropName]: props[itemPropName] };
      }
      const itemIt = BoxModel.getInstance(props[itemPropName]);

      return { [mapItemImToPropName]: itemIt };
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
