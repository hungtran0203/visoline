import React from 'react';
import { compose } from 'recompose';
import classnames from 'classnames';
import Registry from 'libs/Registry';
import _ from 'lodash';

export const withItemEnhancer = () => BaseComponent => {
  return class EnhancedComponent extends React.Component {
    getEnhancers() {
      const { item } = this.props;
      const hocs = _.compact(item.enhancers.toIt().map(boxEnhancerIt => {
        const args = _.omit(boxEnhancerIt.toJS(), ['enhancerId', 'id']);
        const enhancerClass = Registry('HOC_CLASS').get(boxEnhancerIt.enhancer.toId());
        return enhancerClass(args);
      }).toJS());
      if(hocs.length) {
        return compose(...hocs);
      }
      return null;
    
      // const itemIm = storage.getItem(item);
      // const enhancerList = itemIm.get('enhancers');
      // if (enhancerList) {
      //   const hocs = _.compact(enhancerList.map(en => {
      //     const enh = Enhancer.fromIm(en);
      //     if (enh) {
      //       return enh.build();
      //     }
      //   }).toJS());
      //   if(hocs.length) {
      //     return compose(...hocs);
      //   }
      // }
      // return null;
    }
    render() {
      const hoc = this.getEnhancers();
      if(hoc) {
        const Component = hoc(BaseComponent);
        return <Component {...this.props} />  
      } else {
        return <BaseComponent {...this.props} />
      }
    }
  }
};
