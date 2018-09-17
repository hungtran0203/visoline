import React from 'react';
import { ACTIVE_PAGE_STREAM } from 'constants';
import { compose, branch, renderNothing } from 'recompose';
import { withStreamProps } from 'libs/hoc';
import classnames from 'classnames';
import styles from '../../styles.scss';
import withModelStreamProp from 'gen/visoline/hoc/withModelStreamProp';
import withModelSize from 'gen/visoline/hoc/withModelSize';
import BoxModel from 'gen/visoline/model/Box';
import BoxSelection from '../BoxSelection';
import { Set as ISet } from 'immutable';

import { EXPANDED_NODES_STREAM } from '../../constants';

const buildNodes = (acc, { box, level = 0, expandedNodes, excludedSelf } ) => {
  if(box && !box.isNew()) {
    if (!excludedSelf) {
      acc.push((
        <div key={box.getRefId()} className={styles.node}><BoxSelection boxIt={box} level={level} /></div>
      ))  
    }
    const childrenIt = box.children.toIt();
    if (childrenIt && (expandedNodes.has(box.getRefId()) || level === 0)) {
      childrenIt.map((childIt => buildNodes(acc, { box: childIt, expandedNodes, level: level + 1 })))
    }  
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
