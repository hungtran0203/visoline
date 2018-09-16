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
        return typeof enhancerClass === 'function' ? enhancerClass(args) : null;
      }).toJS());
      if(hocs.length) {
        return compose(...hocs);
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
