import React from 'react';

import styles from './styles.scss';
import classnames from 'classnames';
import * as Components from 'reflexbox';
import { compose, withHandlers, withProps, branch, renderNothing } from 'recompose';
import { withStreamProps, withStreams, getStream, pickProps } from 'libs/hoc';
import * as handlers from './handlers';
import withModelStreamProp from 'gen/visoline/hoc/withModelStreamProp';

import 'libs/loader';
import InsertButton from 'components/StorageExplorer/components/Toolbar/InsertButton';
import DeleteButton from 'components/StorageExplorer/components/Toolbar/DeleteButton';
import AppendButton from 'components/StorageExplorer/components/Toolbar/AppendButton';
import GroupButton from 'components/StorageExplorer/components/Toolbar/GroupButton';
import UnGroupButton from 'components/StorageExplorer/components/Toolbar/UnGroupButton';
import RowButton from 'components/StorageExplorer/components/Toolbar/RowButton';
import ColumnButton from 'components/StorageExplorer/components/Toolbar/ColumnButton';

import RenderPage from './components/RenderPage';
import PageViewModeRender from './components/PageViewModeRender';

import { DATA_STREAM, ROOT_ITEM_STREAM } from 'constants';

import { withActivation, ACTIVE_ELEMENT_STREAM, ACTIVE_ITEM_STREAM, ITEM_SELECTION_STREAM,
  Navigator,
} from 'libs/hoc/editor';
import { ACTIVE_PAGE_STREAM } from 'constants';
import * as itemBuilderEnhancers from 'libs/hoc/builder/item';

import CSSStyleInspector from 'components/CSSStyleInspector';
import StorageExplorer from 'components/StorageExplorer';
import BoxProps from 'components/BoxProps';
// import PropsSelectors from 'components/PropsSelectors';
import EnhancerSelector from 'components/EnhancerSelector';

import Page from 'containers/Page';
// import EnhancerExplorer from 'components/EnhancerExplorer';

const { Flex, Box } = Components;


const withEditorHoc = compose(
  itemBuilderEnhancers.withRootItem(),
  itemBuilderEnhancers.withActiveItem$(),
  itemBuilderEnhancers.withRootItem$(),
  itemBuilderEnhancers.withSelectedItems$(),
  itemBuilderEnhancers.setRootItem(),
  itemBuilderEnhancers.setActiveItem(),
);

const RenderActivePage = compose(
  withModelStreamProp({ srcStream: ACTIVE_PAGE_STREAM, dstProp: 'activePageIt', watching: true }),
)(({ activePageIt }) => {
  return <RenderPage item={activePageIt}/>
});

const ActivePageViewModeRender = compose(
  withModelStreamProp({ srcStream: ACTIVE_PAGE_STREAM, dstProp: 'activePageIt', watching: true }),
)(({ activePageIt }) => {
  return <PageViewModeRender item={activePageIt}/>
});

export class Layout extends React.Component {
  componentWillMount() {
    this._nav = new Navigator(this.props.activeItem$);
    // const { doLoad } = this.props;
    // doLoad();
  }

  render() {
    const { doPush, doInsert, doDelete, toColum, toRow, newRoot,
      doSave, doLoad, rootItem, doGroup, doUnGroup, doAddEnh,
      changeBackground,
    } = this.props;
    return (
      <div>
        <Flex justify="space-between">
        </Flex>          
        <Flex justify="space-between">
          <Box w={300}>
            <StorageExplorer />
          </Box>
          <Box w={300}>
            <BoxProps />
          </Box>
          <Box w={300}>
            <EnhancerSelector />
          </Box>
        </Flex>
        <Flex>
          <Box className={styles.btn} onClick={newRoot}>New</Box>
          <Box className={styles.btn} onClick={doSave}>Save</Box>
          <Box className={styles.btn} onClick={doLoad}>Load</Box>
        </Flex>
        <Flex>
          <AppendButton />
          <InsertButton />
          <DeleteButton />
          <ColumnButton />
          <RowButton />
          <GroupButton />
          <UnGroupButton />
          <Box className={styles.btn} onClick={doAddEnh}>AddEnh</Box>
        </Flex>
        <Flex>
          <Box auto>
            <div>
              <Flex>
                <ActivePageViewModeRender />
              </Flex>
            </div>
            <div  className={classnames(styles.container)}>
              <Flex>
                <RenderActivePage />
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
    doAddEnh: handlers.doAddEnh,
    changeBackground: handlers.changeBackground,
  }),
)(Layout);
