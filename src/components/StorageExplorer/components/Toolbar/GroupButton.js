import React from 'react';
import Icon from '@material-ui/core/Icon';
import { compose, branch, renderNothing, withHandlers, withProps } from 'recompose';
import { withModel, withModelStream, withModelStreamProp } from 'libs/model/hoc';
import { withStreamProps, withStreams, composeHandler } from 'libs/hoc';
import { ACTIVE_PAGE_STREAM } from 'constants';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import BoxModel from 'libs/editor/model/box';
import styles from './styles.scss';
import _ from 'lodash';

export const GroupButton = compose(
  withModelStreamProp({ srcStream: ACTIVE_PAGE_STREAM, model: BoxModel, dstProp: 'activePageIt', watching: true }),
  withModelStreamProp({ srcStream: ACTIVE_ITEM_STREAM, model: BoxModel, dstProp: 'activeBoxIt', watching: true }),
  withStreams({ selectedBoxes$: ['box.selected.stream', { init: [] }] }),

  withHandlers({
    onClick: ({ selectedBoxes$, activeBoxIt }) => () => {
      const selectedBoxes = selectedBoxes$.get();
      if (activeBoxIt && _.get(selectedBoxes, 'length')) {
        const parentIt = activeBoxIt.parent.toIt();
        const groupBoxIt = BoxModel.new({ name: 'Group', type: 'Box'});
        [...selectedBoxes, activeBoxIt.getId()].map(boxId => {
          const boxIt = BoxModel.getInstance(boxId);
          boxIt.parent.toIt().children.remove(boxIt);
          boxIt.parent.changeTo(groupBoxIt);
          groupBoxIt.children.push(boxIt);
        });
        parentIt.sync();
        groupBoxIt.parent.changeTo(parentIt);
        parentIt.children.push(groupBoxIt);
      }
    }
  }),
  withProps(({ activeBoxIt }) => ({
    disabled: !activeBoxIt,
  })),
)(
  ({ onClick }) => <div onClick={onClick} className={styles.btn} ><Icon>add</Icon>Group</div>
);

export default GroupButton;
