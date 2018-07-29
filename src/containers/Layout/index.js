import React from 'react';
import styles from './styles.scss';
import classnames from 'classnames';
import * as Components from 'reflexbox';
import { compose, withHandlers, withProps, branch, renderNothing } from 'recompose';
import { withStreamProps, withStreams, getStream, pickProps } from 'libs/hoc';
import { fromJS } from 'immutable';
import uuid from 'uuid';
import invariant from 'invariant';
import _ from 'lodash';
import * as storage from 'libs/storage';
import * as handlers from './handlers';
import * as selectors from './selectors';

import { withActivation, ACTIVE_ELEMENT_STREAM, ACTIVE_ITEM_STREAM, ITEM_SELECTION_STREAM,
  Navigator,
} from 'libs/hoc/editor';
import { withItemWatcher, withItemBuilder, getItemBuilder } from 'libs/hoc/builder';
import CSSStyleInspector from 'components/CSSStyleInspector';
import ColorPicker from 'components/ColorPicker';

const { Flex, Box } = Components;

const DATA_STREAM = 'data.stream';
const ROOT_ITEM_STREAM = 'data.root.stream';

const withEditorHoc = compose(
  withStreamProps({
    rootItem: [ROOT_ITEM_STREAM],
  }),
  withStreams({
    rootItem$: [ROOT_ITEM_STREAM, { init: null }],
    activeItem$: [ACTIVE_ITEM_STREAM, { init: null }],
    selectedItems$: [ITEM_SELECTION_STREAM, { init: [] }],
  }),
  withHandlers({
    setRootItem: ({ rootItem$ }) => (rootItem) => rootItem$.set(rootItem),
    setActiveItem: ({ activeItem$ }) => (activeItem) => activeItem$.set(activeItem),
  }),
);

const editorHOC = [
  withActivation(),
  withItemWatcher(),
];

const ColorModifier = compose(
  withEditorHoc,
  withStreamProps({
    activeItem: [ACTIVE_ITEM_STREAM, { init: null }],
  }),
  branch(({ activeItem }) => !activeItem, renderNothing),
  withHandlers({
    onChange: (props) => (color) => {
      handlers.changeBackground(props)(color);
    }
  }),
  withProps((props) => ({ color: selectors.selectBackground()(props) })),
  pickProps(['onChange', 'onChangeComplete', 'color']),
)((props) => <ColorPicker {...props} />);

const RootItemComponent = compose(
  withItemBuilder(editorHOC),
  getItemBuilder(),
  branch(
    ({ item }) => !item,
    renderNothing,
  )
)(({ itemBuilder, item }) => itemBuilder()(item));

export class Layout extends React.Component {
  componentWillMount() {
    this._nav = new Navigator(this.props.activeItem$);
    const { doLoad } = this.props;
    doLoad();
  }

  render() {
    const { doPush, doInsert, doDelete, toColum, toRow, newRoot,
      doSave, rootItem, doGroup, doUnGroup,
      changeBackground,
    } = this.props;
    return (
      <div>
        <Flex>
          <Box className={styles.btn} onClick={newRoot}>New</Box>
          <Box className={styles.btn} onClick={doSave}>Save</Box>
        </Flex>
        <Flex>
          <Box className={styles.btn} onClick={doPush}>Span</Box>
          <Box className={styles.btn} onClick={doInsert}>Insert</Box>
          <Box className={styles.btn} onClick={doDelete}>Delete</Box>
          <Box className={styles.btn} onClick={toColum}>Col</Box>
          <Box className={styles.btn} onClick={toRow}>Row</Box>
          <Box className={styles.btn} onClick={doGroup}>Group</Box>
          <Box className={styles.btn} onClick={doUnGroup}>UnGroup</Box>
        </Flex>
        <Flex>
          <ColorModifier />
        </Flex>
        <Flex>
          <Box auto>
            <div  className={classnames(styles.container)}>
              <Flex>
                <RootItemComponent item={rootItem} />
              </Flex>
            </div>
          </Box>
          <Flex w={200} justify="space-between" column>
            <ActiveBoxPanel />
          </Flex>
        </Flex>
      </div>
    );
  }
}

const ActiveBoxPanel = compose(
  withStreamProps({
    activeElement: [ACTIVE_ELEMENT_STREAM],
  }),
  branch(
    ({ activeElement }) => !activeElement,
    renderNothing,
  )
)(({ activeElement }) => {
  const cs = window.getComputedStyle(activeElement,null);
  return (
    <Flex column>
      <Flex>
        <Box>Width: {activeElement.offsetWidth} px</Box>
        <Box></Box>
      </Flex>
      <Flex>
        <Box>Height: {activeElement.offsetHeight} px</Box>
        <Box></Box>
      </Flex>
      <Flex>
        <Box>Clien Width: {activeElement.clientWidth} px</Box>
        <Box></Box>
      </Flex>
      <Flex>
        <Box>Clien Height: {activeElement.clientHeight} px</Box>
        <Box></Box>
      </Flex>
      <Flex>
        <Box>Width: </Box>
        <Box>{cs.getPropertyValue('width')}</Box>
      </Flex>
      <CSSStyleInspector element={activeElement}/>
    </Flex>
  );
});

export default compose(
  withEditorHoc,
  withHandlers({
    newRoot: handlers.newRoot,
    doPush: handlers.doPush,
    doInsert: handlers.doInsert,
    doDelete: handlers.doDelete,
    toColum: handlers.toColum,
    toRow: handlers.toRow,
    doSave: handlers.doSave,
    doLoad: handlers.doLoad,
    doGroup: handlers.doGroup,
    doUnGroup: handlers.doUnGroup,
    changeBackground: handlers.changeBackground,
  }),
)(Layout);