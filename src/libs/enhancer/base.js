import _ from 'lodash';
import ajv from 'ajv';
import { fromJS } from 'immutable';
import * as rEnhancers from 'recompose';
import * as enhancers from './index';

export class Enhancer {
  name = '';
  config = null;
  schema = null;
  data = {};
  constructor(config) {
    this.data.config = config;
  }

  validate() {
    if (this.schema) {
      const validate = ajv.compile(this.schema);
      const options = this.getOptions();
      const isValid = validate(options);
      return isValid;
    }
    return true;
  }

  get(prop, unsetVal) {
    return _.get(this.data, prop, unsetVal);
  }

  set(prop, val) {
    _.set(this.data, prop, val);
    return this;
  }

  getEnhancer() {
    return this.enhancer || rEnhancers[this.get('enhancer')];
  }

  getName() {
    return this.name;
  }

  getInputProps() {
    return null;
  }

  getOutputProps() {
    return null;
  }

  getOptions() {
    return this.get('config.options', {});
  }

  build() {
    const enhancer = this.getEnhancer();
    if (this.validate()) {
      return enhancer(...this.getOptions());
    }
    return null;
  }

  toIm() {
    return fromJS(this.data);
  }

  static fromIm(im) {
    if (im && _.get(im, 'toJS')) {
      const data = im.toJS();
      const enhancerName = _.get(data, 'enhancer');
      let Enh;
      if (Enh = enhancers[enhancerName]) {
        const rtn = new Enh(data.config);
        rtn.set('id', data.id);
        return rtn;
      }
    }
  }
}
