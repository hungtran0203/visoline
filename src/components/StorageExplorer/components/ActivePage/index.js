import React from 'react';
import Icon from '@material-ui/core/Icon';
import { ACTIVE_PAGE_STREAM, ROOT_ITEM_STREAM } from 'constants';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import { compose, withHandlers, withState, renderComponent, branch, renderNothing, withProps } from 'recompose';
import { SHOW_PAGE_LIST_STREAM } from '../../constants';
import { withStreamProps, withStreams } from 'libs/hoc';
import { withModelStream, withModelStreamProp } from 'libs/model/hoc';
import EditableText from 'components/EditableText';
import classnames from 'classnames';
import { Flex, Box } from 'reflexbox';
import styles from '../../styles.scss';
import { withModelSize } from 'libs/model/hoc';
import BoxModel from 'libs/editor/model/box';
import BoxSelection from '../BoxSelection';
import { Set as ISet } from 'immutable';

import { EXPANDED_NODES_STREAM } from '../../constants';

const buildNodes = (acc, { box, level = 0, expandedNodes, excludedSelf } ) => {
  if (!excludedSelf) {
    acc.push((
      <div key={box.getRefId()} className={styles.node}><BoxSelection boxIt={box} level={level} /></div>
    ))  
  }
  const childrenIt = box.children.toIt();
  if (childrenIt && (expandedNodes.has(box.getRefId()) || level === 0)) {
    childrenIt.map((childIt => buildNodes(acc, { box: childIt, expandedNodes, level: level + 1 })))
  }
  return acc;
};

export const ActivePage = compose(
  withModelStreamProp({ srcStream: ACTIVE_PAGE_STREAM, dstProp: 'activePageIt', watching: true }),
  withStreamProps({ expandedNodes: [EXPANDED_NODES_STREAM, { init: new ISet() }] }),
  withModelSize({ model: BoxModel, dstProp: 'boxCount' }),
  branch(({ activePageIt }) => !activePageIt, renderNothing),
)(({ activePageIt, expandedNodes, className, boxCount }) => {
  return (
    <div className={classnames(styles.container, className)} >
      {buildNodes([], { box: activePageIt, expandedNodes, level: 0, excludedSelf: true } )}
    </div>    
  )
});

export default ActivePage;
