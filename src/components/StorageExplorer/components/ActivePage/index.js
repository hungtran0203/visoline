import React from 'react';
import Icon from '@material-ui/core/Icon';
import { ACTIVE_PAGE_STREAM, ROOT_ITEM_STREAM } from 'constants';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import { compose, withHandlers, withState, renderComponent, branch, renderNothing, withProps } from 'recompose';
import { SHOW_PAGE_LIST_STREAM } from '../../constants';
import { withStreamProps, withStreams } from 'libs/hoc';
import { withModel, withModelStream, withModelStreamProp } from 'libs/model/hoc';
import EditableText from 'components/EditableText';
import classnames from 'classnames';
import { Flex, Box } from 'reflexbox';
import styles from '../../styles.scss';

import BoxModel from 'libs/editor/model/box';

import Header from '../Header';

const EXPANDED_NODES_STREAM = 'tree.expanded.nodes';

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

const BoxSummary = compose(
  withModelStreamProp({ srcStream: ACTIVE_ITEM_STREAM, model: BoxModel, dstProp: 'activeBoxIt', watching: true }),
  withStreams({ activeItem$: [ACTIVE_ITEM_STREAM, { init: null }] }),
  withState('expanded', 'setExpanded', false),
  withHandlers({
    onClick: ({ activeItem$, boxIt }) => () => activeItem$.set(boxIt.getId()),
    toggleExpand: ({ setExpanded, expanded }) => () => setExpanded(!expanded),
    onSaveName: ({ boxIt }) => (name) => {
      boxIt.set('name', name).save();
    },
  }),
  withProps(({ activeBoxIt, boxIt }) => ({ isActive: activeBoxIt && activeBoxIt.getId() === boxIt.getId() })),
)(({ boxIt, activeBoxIt, level, onSaveName, onClick, isActive }) => {
  const children = boxIt.children.toIm();
  return (
    <Flex className={classnames(styles.panelSummary, { [styles.isActive]: isActive })} align="center">
      <LevelPrefix level={children.size ? level : level + 1} />
      {
        children.size ?
          <ExpandIcon itemIt={boxIt}/> :
          <PrefixSpan><Icon className={classnames(styles.icon, styles.primary)} >crop_din</Icon></PrefixSpan>
      }
      { 
        children.size ?
          <PrefixSpan><Icon className={classnames(styles.icon, styles.primary)} >folder</Icon></PrefixSpan> :
          null
      }
      <Box className={classnames(styles.text)} onClick={onClick} auto>
        <EditableText value={boxIt.getOneOf(['name', 'id'])} onSave={onSaveName}/>
      </Box>
      <PrefixSpan className={classnames(styles.append)}><Icon className={classnames(styles.icon, styles.muted)}>lock</Icon></PrefixSpan>
    </Flex>
  )
});

const BoxExplorer = compose(
  withStreams({
    rootItem$: [ROOT_ITEM_STREAM, { init: null }],
  }),
  withHandlers({
    onClick: ({ rootItem$, item }) => () => rootItem$.set(item),
  }),
)(({ boxIt, level }) => {
  return (
    <div className={styles.item}>
      <BoxSummary boxIt={boxIt} level={level}/>
    </div>
  )
});

const buildNodes = (acc, { box, level = 0, expandedNodes, excludedSelf } ) => {
  if (!excludedSelf) {
    acc.push((
      <div key={box.getId()} className={styles.node}><BoxExplorer boxIt={box} level={level} /></div>
    ))  
  }
  const childrenIt = box.children.toIt();
  if (childrenIt && (expandedNodes.has(box.getId()) || level === 0)) {
    childrenIt.map((childIt => buildNodes(acc, { box: childIt, expandedNodes, level: level + 1 })))
  }
  return acc;
};

export const ActivePage = compose(
  withModelStreamProp({ srcStream: ACTIVE_PAGE_STREAM, model: BoxModel, dstProp: 'activePageIt', watching: true }),
  withStreamProps({ expandedNodes: [EXPANDED_NODES_STREAM, { init: new Set() }] }),
  branch(({ activePageIt }) => !activePageIt, renderNothing),
)(({ activePageIt, expandedNodes, className }) => {
  return (
    <div className={classnames(styles.container, className)} >
      {buildNodes([], { box: activePageIt, expandedNodes, level: 0, excludedSelf: true } )}
    </div>    
  )
});

export default ActivePage;
