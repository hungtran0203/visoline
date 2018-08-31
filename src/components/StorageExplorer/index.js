import React from 'react';
import styles from './styles.scss';
import classnames from 'classnames';
import _ from 'lodash';
import { compose, withHandlers, withState, renderComponent, branch, renderNothing } from 'recompose';
import { withStreams, withStreamProps } from 'libs/hoc';
import { withItemWatcher, withItemImOrNothing, withItemItOrNothing, withItemIt } from 'libs/hoc/builder';
import { withRootItem, withRootItem$, withActiveItem } from 'libs/hoc/builder/item';

import * as itemBuilderEnhancers from 'libs/hoc/builder/item';
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
import Item from 'libs/storage/item';

import PageListPanel from './components/PageListPanel';
import PageList from './components/PageList';

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
  withItemIt(),
  withHandlers({
    onClick: ({ itemIt, expandedNodes$ }) => () => {
      if (itemIt.isExists()) {
        let expandedNodes = expandedNodes$.get();
        const itemId = itemIt.getId();
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
  withProps(({ expandedNodes, itemIt }) => {
    return { expanded: expandedNodes.has(itemIt.getId()) };
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
    activeItem: [ACTIVE_ITEM_STREAM, { init: null }],
  }),
  withStreams({
    activeItem$: [ACTIVE_ITEM_STREAM, { init: null }],
  }),
  withState('expanded', 'setExpanded', false),
  withItemIt(),
  withHandlers({
    onClick: ({ activeItem$, item }) => () => activeItem$.set(item),
    toggleExpand: ({ setExpanded, expanded }) => () => setExpanded(!expanded),
    onSaveName: ({ itemIt }) => (name) => {
      if (itemIt.isExists()) {
        itemIt.set('name', name).save();
      }
    },
  }),
  withItemWatcher(),
)(({ item, activeItem, level, onSaveName, onClick }) => {
  const itemIt = Item.getInstance(item);
  const activeItemIt = Item.getInstance(activeItem);
  const isActive = activeItemIt.isExists() && activeItemIt.getId() === itemIt.getId();
  const children = itemIt.children.toIm();
  return (
    <Flex className={classnames(styles.panelSummary, { [styles.isActive]: isActive })} align="center">
      <LevelPrefix level={children.size ? level : level + 1} />
      {
        children.size ?
          <ExpandIcon item={item}/> :
          <PrefixSpan><Icon className={classnames(styles.icon, styles.primary)} >crop_din</Icon></PrefixSpan>
      }
      { 
        children.size ?
          <PrefixSpan><Icon className={classnames(styles.icon, styles.primary)} >folder</Icon></PrefixSpan> :
          null
      }
      <Box className={classnames(styles.text)} onClick={onClick} auto>
        <EditableText value={itemIt.getOneOf(['name', 'id'])} onSave={onSaveName}/>
      </Box>
      <PrefixSpan className={classnames(styles.append)}><Icon className={classnames(styles.icon, styles.muted)}>lock</Icon></PrefixSpan>
    </Flex>
  )
});

const ItemExplorer = compose(
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
  const itemIt = Item.getInstance(node);
  if (!excludedSelf) {
    acc.push((
      <div key={itemIt.getId()} className={styles.node}><ItemExplorer item={itemIt.toIm()} level={level} /></div>
    ))  
  }
  const childrenIm = itemIt.children.toIm();
  if (childrenIm && (expandedNodes.has(itemIt.getId()) || level === 0)) {
    childrenIm.map((child => buildNodes(acc, { node: child, expandedNodes, level: level + 1 })))
  }
  return acc;
}

const Header = ({ children }) => (
  <Flex justify="space-between" className={classnames(styles.row, styles.header)}>
    {children}
  </Flex>
);

const ActivePagePanel = compose(
  itemBuilderEnhancers.withRootItemWatcher('item'),
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
  withRootItem('item'),
  withItemImOrNothing,
  withItemIt(),
  withStreamProps({ expandedNodes: [EXPANDED_NODES_STREAM, { init: new Set() }] }),
  withItemWatcher(),
)(({ itemIt, itemIm, expandedNodes, className }) => {
  return (
    <div className={classnames(styles.container, className)} >
      {buildNodes([], { node: itemIm, expandedNodes, level: 0, excludedSelf: true } )}
    </div>    
  )
});

export const StorageExplorer = ({ children, ratio }) => (
  <div className={styles.wrapper}>
    <PageListPanel />
    <PageList />
    <ActivePagePanel />
    <ActivePageExplorer />
  </div>
);

export default StorageExplorer;
