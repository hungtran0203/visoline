import React from 'react';
import styles from './styles.scss';
import * as storage from 'libs/storage';
import classnames from 'classnames';
import _ from 'lodash';
import { compose, withHandlers, withState, renderComponent, branch, renderNothing } from 'recompose';
import { withStreams, withStreamProps } from 'libs/hoc';
import { withItemWatcher, withItemImOrNothing, withRootItem, withRootItemWatcher, withNewRootHandler } from 'libs/hoc/builder';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import { ROOT_ITEM_STREAM } from 'constants';
import * as layoutHandlers from 'containers/Layout/handlers';

import Icon from '@material-ui/core/Icon';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Flex, Box } from 'reflexbox';
import { Set } from 'immutable';
import withProps from 'recompose/withProps';
import EditableText from 'components/EditableText';
import withPropsOnChange from 'recompose/withPropsOnChange';

const EXPANDED_NODES_STREAM = 'tree.expanded.nodes';
const SHOW_PAGE_LIST_STREAM = 'tree.pagelist.show';

const PrefixSpan = ({ children, className }) => {
  return (
    <div className={classnames(styles.prefixSpan, className)}>
      {children}
    </div>
  )
}

const ExpandIcon = compose(
  withStreams({ expandedNodes$: [EXPANDED_NODES_STREAM, { init: new Set() }] }),
  withHandlers({
    onClick: ({ item, expandedNodes$ }) => () => {
      const itemIm = storage.getItem(item);
      if (itemIm) {
        let expandedNodes = expandedNodes$.get();
        const itemId = itemIm.get('id');
        if (expandedNodes.has(itemId)) {
          expandedNodes = expandedNodes.delete(itemId)
        } else {
          expandedNodes = expandedNodes.add(itemId);
        }
        expandedNodes$.set(expandedNodes)
      }
    },
  }),
  withStreamProps({ expandedNodes: [EXPANDED_NODES_STREAM, { init: new Set() }] }),
  withProps(({ expandedNodes, item }) => {
    const itemIm = storage.getItem(item);
    return { expanded: expandedNodes.has(itemIm.get('id')) };
  }),
)(({ onClick, className, expanded }) => {
  return (
    <div className={classnames(styles.expandIcon, className)} onClick={onClick}>
      {
        expanded ?
          <Icon className={classnames(styles.expandIcon, styles.muted)}>arrow_drop_down</Icon> :
          <Icon className={classnames(styles.expandIcon, styles.muted)}>arrow_right</Icon>
      }
    </div>
  )
});

const LEVEL_PREFIX_WIDTH = 24;
const LevelPrefix = ({ level }) => ( level ? <div style={{ flex: `0 0 ${level * LEVEL_PREFIX_WIDTH}px`}}/> : null)

const PanelSummary = compose(
  withStreamProps({
    rootItem: [ROOT_ITEM_STREAM],
    activeItem: [ACTIVE_ITEM_STREAM, { init: null }],
  }),
  withStreams({
    rootItem$: [ROOT_ITEM_STREAM, { init: null }],
    activeItem$: [ACTIVE_ITEM_STREAM, { init: null }],
  }),
  withState('expanded', 'setExpanded', false),
  withHandlers({
    onClick: ({ activeItem$, item }) => () => activeItem$.set(item),
    toggleExpand: ({ setExpanded, expanded }) => () => setExpanded(!expanded),
    onSaveName: ({ item }) => (name) => {
      const itemIm = storage.getItem(item);
      if (itemIm) {
        storage.updateItem(itemIm.set('name', name));
      }
    },
  }),
  withItemWatcher(),
)(({ item, activeItem, level, onSaveName, onClick }) => {
  const itemIm = storage.getItem(item);
  const activeItemIm = storage.getItem(activeItem);
  const isActive = activeItemIm && activeItemIm.get('id') === itemIm.get('id');
  const children = storage.getChildren(itemIm);
  return (
    <Flex className={classnames(styles.panelSummary, { [styles.isActive]: isActive })} align="center">
      <LevelPrefix level={children.length ? level : level + 1} />
      {
        children.length ?
          <ExpandIcon item={item}/> :
          <PrefixSpan><Icon className={classnames(styles.icon, styles.primary)} >crop_din</Icon></PrefixSpan>
      }
      { 
        children.length ?
          <PrefixSpan><Icon className={classnames(styles.icon, styles.primary)} >folder</Icon></PrefixSpan> :
          null
      }
      <Box className={classnames(styles.text)} onClick={onClick} auto>
        <EditableText value={itemIm.get('name', itemIm.get('id'))} onSave={onSaveName}/>
      </Box>
      <PrefixSpan className={classnames(styles.append)}><Icon className={classnames(styles.icon, styles.muted)}>lock</Icon></PrefixSpan>
    </Flex>
  )
});

const ItemExplorer = compose(
  withStreamProps({
    rootItem: [ROOT_ITEM_STREAM],
  }),
  withStreams({
    rootItem$: [ROOT_ITEM_STREAM, { init: null }],
  }),
  withHandlers({
    onClick: ({ rootItem$, item }) => () => rootItem$.set(item),
  }),
)(({ item, level }) => {
  return (
    <div className={styles.item}>
      <PanelSummary item={item} level={level}/>
    </div>
  )
});

const buildNodes = (acc, { node, level = 0, expandedNodes, excludedSelf } ) => {
  const itemIm = storage.getItem(node);
  if (!excludedSelf) {
    acc.push((
      <div key={itemIm.get('id')} className={styles.node}><ItemExplorer item={itemIm} level={level} /></div>
    ))  
  }
  const children = storage.getChildren(node);
  if (children && (expandedNodes.has(itemIm.get('id')) || level === 0)) {
    children.map((child => buildNodes(acc, { node: child, expandedNodes, level: level + 1 })))
  }
  return acc;
}

const PageSelection = compose(
  withItemImOrNothing,
  withStreamProps({
    rootItem: [ROOT_ITEM_STREAM],
  }),
  withStreams({
    rootItem$: [ROOT_ITEM_STREAM, { init: null }],
  }),
  withHandlers({
    onClick: ({ rootItem$, item }) => () => rootItem$.set(item),
    onSaveName: ({ itemIm }) => (name) => {
      storage.updateItem(itemIm.set('name', name));
    },
  }),
  withItemWatcher(),
)(({ item, onClick, rootItem, onSaveName }) => {
  const activeRootIm = storage.getItem(rootItem);
  const itemIm = storage.getItem(item);
  const isActive = activeRootIm && activeRootIm.get('id') === itemIm.get('id');
  return (
    <div className={classnames(styles.row, styles.rootItem, { [styles.isActive]: isActive })} onClick={onClick}>
      <EditableText value={itemIm.get('name', itemIm.get('id'))} onSave={onSaveName}/>
    </div>
  )
});

const PageListSelection = compose(
  withStreamProps({
    showPageList: [SHOW_PAGE_LIST_STREAM, { init: true }],
  }),
  branch(({ showPageList }) => !showPageList, renderNothing),
  withStreams({
    rootItem$: [ROOT_ITEM_STREAM, { init: null }],
  }),
)(() => {
  return (
    <Box className={classnames(styles.pageSelection)}>
      {
        storage.getItems().map(itemId => {
          if (!storage.isRootItem(itemId)) return null;
          return (
            <PageSelection key={itemId} item={itemId}/>
          )
        })
      }
    </Box>
  )
});

const Header = ({ children }) => (
  <Flex justify="space-between" className={classnames(styles.row, styles.header)}>
    {children}
  </Flex>
)

const PageListPanel = compose(
  withStreamProps({
    showPageList: [SHOW_PAGE_LIST_STREAM, { init: true }],
  }),
  branch(({ showPageList }) => !showPageList, renderNothing),
  withNewRootHandler('addPage'),
)(({ addPage }) => (
  <Header>
    <div>Pages</div>
    <div onClick={addPage}><Icon>add</Icon></div>
  </Header>

));

const ActivePagePanel = compose(
  withRootItemWatcher('item'),
  withItemImOrNothing,
  withStreams({
    showPageList$: [SHOW_PAGE_LIST_STREAM, { init: true }],
  }),
  withStreamProps({
    showPageList: [SHOW_PAGE_LIST_STREAM, { init: true }],
  }),
  withHandlers({
    togglePageList: ({ showPageList$ }) => () => showPageList$.set(!showPageList$.get()),
  })
)(({ itemIm, togglePageList, showPageList }) => {
  console.log('tititi', itemIm.get('name'));
  return (
    <Header>
      <div>{itemIm.get('name', itemIm.get('id'))}</div>
      <div onClick={togglePageList}>
        {
          !!showPageList ?
            <Icon>expand_less</Icon>:
            <Icon>expand_more</Icon>
        }
      </div>
    </Header>
  );
});

const ActivePageExplorer = compose(
  withStreamProps({
    item: [ROOT_ITEM_STREAM],
  }),
  withItemImOrNothing,
  withStreams({
    rootItem$: [ROOT_ITEM_STREAM],
  }),
  withStreamProps({ expandedNodes: [EXPANDED_NODES_STREAM, { init: new Set() }] }),
  withItemWatcher(),
)(({ itemIm , rootItem, expandedNodes, className }) => {
  const activeRootIm = storage.getItem(rootItem);
  const isActive = activeRootIm && activeRootIm.get('id') === itemIm.get('id');
  return (
    <div className={classnames(styles.container, className)} >
      {buildNodes([], { node: itemIm, expandedNodes, level: 0, excludedSelf: true } )}
    </div>    
  )
});

export const StorageExplorer = ({ children, ratio }) => (
  <div className={styles.wrapper}>
    <PageListPanel />
    <PageListSelection />
    <ActivePagePanel />
    <ActivePageExplorer />
  </div>
);

export default StorageExplorer;
