import { Enhancer } from './base';
import { withHandlers as rWithHandlers } from 'recompose';
import _ from 'lodash';
import { lookup } from 'libs/propsSelectors';

export class withHandlers extends Enhancer {
  name = 'withHandlers';
  enhancer = rWithHandlers;
  schema = null;

  constructor(config) {
    super(config);
    this.set('enhancer', this.name);
  }

  getInputProps() {
    return null;
  }

  getOutputProps() {
    const options = this.getOptions();
    const stateName = _.get(options, 'stateName');
    return {
      properties: {
        [stateName]: { type: 'string' },
      },
      required: [stateName],
    };
  }

  getOptions() {
    const opts = super.getOptions();
    const props = _.get(opts, 'props');
    const options = {};
    Object.keys(props).map(propName => {
      const handler = lookup(props[propName]);
      if (handler) {
        options[propName] = handler;
      }
    })
    return [options];
  }
}
