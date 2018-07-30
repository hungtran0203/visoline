import React from 'react';
import styles from './styles.scss';
import * as storage from 'libs/storage';
import classnames from 'classnames';
import { compose, withHandlers, withState } from 'recompose';
import { withStreams, withStreamProps } from 'libs/hoc';
import { ROOT_ITEM_STREAM } from 'constants';

import Icon from '@material-ui/core/Icon';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const ItemExplorer = compose(
  withStreamProps({
    rootItem: [ROOT_ITEM_STREAM],
  }),
  withStreams({
    rootItem$: [ROOT_ITEM_STREAM, { init: null }],
  }),
  withState('expanded', 'setExpanded', false),
  withHandlers({
    onClick: ({ rootItem$, item }) => () => rootItem$.set(item),
    toggleExpand: ({ setExpanded, expanded }) => () => setExpanded(!expanded),
  }),
)(({ item , onClick, rootItem, expanded, toggleExpand }) => {
  const itemIm = storage.getItem(item);
  const activeRootIm = storage.getItem(rootItem);
  const isActive = activeRootIm && activeRootIm.get('id') === itemIm.get('id');
  return (
    <div >
      <ExpansionPanel expanded={expanded} onChange={toggleExpand}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          {itemIm.get('id')}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {
            itemIm.get('children').map(child => {
              const childIm = storage.getItem(child);
              if (!childIm) return null;
              return (
                <div key={child}>
                  <ItemExplorer item={child} />
                </div>
              )
            })
          }
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  )
});

const RootItemExplorer = compose(
  withStreamProps({
    rootItem: [ROOT_ITEM_STREAM],
  }),
  withStreams({
    rootItem$: [ROOT_ITEM_STREAM, { init: null }],
  }),
  withHandlers({
    onClick: ({ rootItem$, item }) => () => rootItem$.set(item),
  }),
)(({ item , onClick, rootItem }) => {
  const itemIm = storage.getItem(item);
  const activeRootIm = storage.getItem(rootItem);
  const isActive = activeRootIm && activeRootIm.get('id') === itemIm.get('id');
  return (
    <div className={classnames(styles.container, { [styles.isActive]: isActive })} onClick={onClick}>
      <ItemExplorer item={itemIm} />
    </div>
  )
});

export const StorageExplorer = ({ children, ratio }) => (
  <div className={styles.square}>
  {
    storage.getItems().map(itemId => {
      if (!storage.isRootItem(itemId)) return null;
      return (
        <div key={itemId}>
          <RootItemExplorer item={itemId} />
        </div>
      )
    })
  }
  </div>
);

export default StorageExplorer;
