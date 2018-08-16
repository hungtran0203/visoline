import { compose, withProps } from 'recompose';
import EnhancerItem from 'libs/storage/enhancer';
import _ from 'lodash';

export const withEnhancerIm = (mapEnhImToPropName = 'enhIm', enhPropName='enh' ) => compose(
  withProps((props) => {
    if (!_.has(props, mapEnhImToPropName)) {
      return { [mapEnhImToPropName]: (EnhancerItem.getInstance(props[enhPropName])).toIm() };
    }
  }),
);

export const withEnhancerIt = (mapEnhItToPropName = 'enhIt', enhPropName='enh' ) => compose(
  withProps((props) => {
    if (!_.has(props, mapEnhItToPropName)) {
      return { [mapEnhItToPropName]: EnhancerItem.getInstance(props[enhPropName]) };
    }
  }),
);
