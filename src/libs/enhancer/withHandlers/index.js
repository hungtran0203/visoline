import React from 'react';
import { Enhancer } from 'libs/enhancer/base';
import { withHandlers as rWithHandlers } from 'recompose';
import _ from 'lodash';
import uuid from 'uuid';
import { toJS } from 'immutable';

import { lookup } from 'libs/propsSelectors';
import { ConfigureUI } from './ConfigureUI';
import { getStream } from 'libs/hoc/stream';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import Item from 'libs/storage/item';

import storage from 'libs/storage';

const ACTIVE_ENHANCER_STREAM = 'enhancer.active.item';

export class withHandlers extends Enhancer {
  name = 'withHandlers';
  enhancer = rWithHandlers;
  schema = null;

  constructor(dataIm) {
    super(dataIm);
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

  getOptions(format='object') {
    const opts = super.getOptions();
    switch(format) {
      case 'raw':
        return opts;
      case 'object':
        const props = toJS(opts.get('props'));
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

  addHandler(propName, propSelector) {
    const opts = this.getOptions('raw');
    _.set(opts, `props.${propName}`, propSelector);
    const activeItem$ = getStream(ACTIVE_ITEM_STREAM);
    const activeEnhancer$ = getStream(ACTIVE_ENHANCER_STREAM);
    
    const activeItem = activeItem$.get();
    const enhancers = activeItem.get('enhancers');
    if (!this.get('id')) {
      this.set('id', uuid());
    }

    let found = false;
    let newEnhancers = enhancers.map(enh => {
      const enhIns = Enhancer.fromIm(enh);
      if(enhIns.get('id') === this.get('id')) {
        found = true;
        return this.toIm();
      }
      return enh;
    });
    if (!found) {
      newEnhancers = newEnhancers.push(this.toIm());
    }
    // const en
    const newItem = activeItem.set('enhancers', newEnhancers);
    storage.updateItem(newItem);
    return this;
  }

  getConfigureUI() {
    return <ConfigureUI enh={this} />
  }
}
