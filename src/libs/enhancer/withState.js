import { Enhancer } from './base';
import { withState as rWithState } from 'recompose';
import _ from 'lodash';

export class withState extends Enhancer {
  name = 'withState';
  enhancer = rWithState;
  schema = {
    properties: {
      stateName: { type: 'string' },
      stateUpdaterName: { type: 'string' },
      initialState: {},
    },
    required: ['stateName'],
  };

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
    const options = _.pick(opts, ['stateName', 'stateUpdaterName', 'initialState']);
    // compute options
    return options;
  }
}
