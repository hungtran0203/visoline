import React from 'react';
import Icon from '@material-ui/core/Icon';
import { ACTIVE_ITEM_STREAM, ACTIVE_ELEMENT_STREAM } from 'libs/hoc/editor';
import { compose, withHandlers, withState, withProps } from 'recompose';
import { withStreamProps, withStreams, composeHandler } from 'libs/hoc';
import { withModelStreamProp } from 'libs/model/hoc';
import EditableText from 'components/EditableText';
import classnames from 'classnames';
import { Flex, Box } from 'reflexbox';
import styles from '../../styles.scss';
import { CTRL_KEY_STATE } from 'libs/hoc/editor';
import { Set as ISet } from 'immutable';

import { EXPANDED_NODES_STREAM } from '../../constants';

const PrefixSpan = ({ children, className }) => {
  return (
    <div className={classnames(styles.prefixSpan, className)}>
      {children}
    </div>
  )
}

const ExpandIcon = compose(
  withStreams({ expandedNodes$: [EXPANDED_NODES_STREAM, { init: new ISet() }] }),
  withHandlers({
    onClick: ({ itemIt, expandedNodes$ }) => () => {
      if (itemIt && itemIt.isExists()) {
        let expandedNodes = expandedNodes$.get();
        const itemRefId = itemIt.getRefId();
        if (expandedNodes.has(itemRefId)) {
          expandedNodes = expandedNodes.remove(itemRefId)
        } else {
          expandedNodes = expandedNodes.add(itemRefId);
        }
        expandedNodes$.set(expandedNodes)
      }
    },
  }),
  withStreamProps({ expandedNodes: [EXPANDED_NODES_STREAM, { init: new ISet() }] }),
  withProps(({ expandedNodes, itemIt }) => {
    return { expanded: expandedNodes.has(itemIt.getRefId()) };
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
  withModelStreamProp({ srcStream: ACTIVE_ITEM_STREAM, dstProp: 'activeBoxIt', watching: true }),
  withStreams({ activeBox$: [ACTIVE_ITEM_STREAM, { init: null }] }),
  withState('expanded', 'setExpanded', false),
  withStreams({
    activeBox$: [ACTIVE_ITEM_STREAM, { init: null }],
    activationEle$: [ACTIVE_ELEMENT_STREAM, { init: null }],
    ctrlKey$: CTRL_KEY_STATE,
  }),
  withStreams({
    selectedBoxes$: ['box.selected.stream', { init: [] }],
  }),
  withStreamProps({
    selectedBoxes: ['box.selected.stream', { init: [] }],
  }),
  composeHandler({
    handlerName: 'onClick',
    handlerFn: ({ activeBox$, activationEle$, selectedBoxes$, ctrlKey$, boxIt }) => (e) => {
      activationEle$.set(e.target);
      e.stopPropagation();
      const prevItem = activeBox$.get();
      if (prevItem && ctrlKey$.get()) {
        const selectedBoxes = selectedBoxes$.get() || [];
        selectedBoxes.push(prevItem);
        selectedBoxes$.set(selectedBoxes);
      } else {
        selectedBoxes$.set([]);
      }
    }
  }),
  composeHandler({
    handlerName: 'onClick',
    handlerFn: ({ activeBox$, boxIt }) => () => activeBox$.set(boxIt.getRefId()),
  }),  
  withHandlers({
    toggleExpand: ({ setExpanded, expanded }) => () => setExpanded(!expanded),
    onSaveName: ({ boxIt }) => (name) => {
      boxIt.set('name', name).save();
    },
  }),
  withProps(({ activeBoxIt, boxIt, selectedBoxes }) => ({
    isActive: (activeBoxIt && activeBoxIt.getRefId() === boxIt.getRefId()) || selectedBoxes.includes(boxIt.getRefId()),
  })),
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

const BoxSelection = compose(
  composeHandler({
    handlerName: 'onClick',
    handlerFn: ({ activeBox$, boxIt }) => () => activeBox$.set(boxIt.getRefId()),
  }),
  withStreams({ expandedNodes$: [EXPANDED_NODES_STREAM, { init: new ISet() }] }),
  withHandlers({
    onClick: ({ boxIt, expandedNodes$ }) => () => {
      if (boxIt) {
        let expandedNodes = expandedNodes$.get();
        const boxRefId = boxIt.getRefId();
        if (!expandedNodes.has(boxRefId)) {
          expandedNodes = expandedNodes.add(boxRefId);
          expandedNodes$.set(expandedNodes)
        }
      }
    },
  }),  
)(({ boxIt, level, onClick }) => {
  return (
    <div className={styles.item} >
      <BoxSummary boxIt={boxIt} level={level} onClick={onClick}/>
    </div>
  )
});

export default BoxSelection;
