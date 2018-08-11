import React from 'react';
import classnames from 'classnames';
import * as Components from 'reflexbox';
import { compose, withHandlers, withProps, branch, renderNothing } from 'recompose';
import { withStreamProps, withStreams, getStream, pickProps } from 'libs/hoc';
import { fromJS } from 'immutable';
import uuid from 'uuid';
import invariant from 'invariant';
import _ from 'lodash';
import * as storage from 'libs/storage';

import { DATA_STREAM, ROOT_ITEM_STREAM } from 'constants';

import { withActivation, ACTIVE_ELEMENT_STREAM, ACTIVE_ITEM_STREAM, ITEM_SELECTION_STREAM,
  Navigator,
} from 'libs/hoc/editor';
import { withItemWatcher, withItemBuilder, getItemBuilder, withItemEnhancer } from 'libs/hoc/builder';
import CSSStyleInspector from 'components/CSSStyleInspector';
import ColorPicker from 'components/ColorPicker';
import RatioBox from 'components/RatioBox';
import StorageExplorer from 'components/StorageExplorer';
import PropsSelectors from 'components/PropsSelectors';

const { Flex, Box } = Components;


const withPageHoc = compose(
  withStreamProps({
    rootItem: [ROOT_ITEM_STREAM],
  }),
  withStreams({
    rootItem$: [ROOT_ITEM_STREAM, { init: null }],
  }),
);

const viewModeHOC = [
  withItemEnhancer(),
  withItemWatcher(),
];

const RootItemComponent = compose(
  withItemBuilder(viewModeHOC),
  getItemBuilder(),
  branch(
    ({ item }) => !item,
    renderNothing,
  )
)(({ itemBuilder, item }) => itemBuilder()(item));


export class Page extends React.Component {
  render() {
    return (
      <RootItemComponent item={this.props.rootItem} />
    );
  }
}

export default compose(
  withPageHoc,
)(Page);
