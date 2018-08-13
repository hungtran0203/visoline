import React from 'react';
import {  compose } from 'recompose';
import storage from 'libs/storage';
import classnames from 'classnames';
import { Enhancer } from 'libs/enhancer';
import _ from 'lodash';

export const withItemEnhancer = () => BaseComponent => {
  return class EnhancedComponent extends React.Component {
    getEnhancers() {
      const { item } = this.props;
      const itemIm = storage.getItem(item);
      const enhancerList = itemIm.get('enhancers');
      if (enhancerList) {
        const hocs = _.compact(enhancerList.map(en => {
          const enh = Enhancer.fromIm(en);
          if (enh) {
            return enh.build();
          }
        }).toJS());
        if(hocs.length) {
          return compose(...hocs);
        }
      }
      return null;
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
