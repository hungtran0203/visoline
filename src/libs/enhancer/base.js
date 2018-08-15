import _ from 'lodash';
import ajv from 'ajv';
import { fromJS, isImmutable } from 'immutable';
import * as rEnhancers from 'recompose';
import * as enhancers from './index';

export class Enhancer {
  name = '';
  config = null;
  schema = null;
  dataIm = fromJS({});
  constructor(dataIm) {
    this.dataIm = dataIm;
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
    return this.dataIm.get(prop, unsetVal);
  }

  set(prop, val) {
    this.dataIm = this.dataIm.set(prop, val);
    return this;
  }

  getEnhancer() {
    return this.enhancer || rEnhancers[this.get('enhancer')];
  }

  getName() {
    return this.get('name');
  }

  getInputProps() {
    return null;
  }

  getOutputProps() {
    return null;
  }

  getOptions() {
    return this.get('options', fromJS({}));
  }

  build() {
    const enhancer = this.getEnhancer();
    if (this.validate()) {
      return enhancer(...this.getOptions());
    }
    return null;
  }

  toIm() {
    return this.dataIm;
  }

  static fromIm(im) {
    if (_.isObject(im)) {
      const enhancerName = im.get('enhancer');
      let Enh;
      if (Enh = enhancers[enhancerName]) {
        const rtn = new Enh(im);
        return rtn;
      }  
    }
  }
}
