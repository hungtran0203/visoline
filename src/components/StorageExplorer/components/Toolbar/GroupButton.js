import React from 'react';
import Icon from '@material-ui/core/Icon';
import { compose, withHandlers, withProps } from 'recompose';
import withModelStreamProp from 'gen/visoline/hoc/withModelStreamProp';
import { withStreams } from 'libs/hoc';
import { ACTIVE_PAGE_STREAM } from 'constants';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import BoxModel from 'gen/visoline/model/Box';
import styles from './styles.scss';
import _ from 'lodash';

export const GroupButton = compose(
  withModelStreamProp({ srcStream: ACTIVE_PAGE_STREAM, dstProp: 'activePageIt', watching: true }),
  withModelStreamProp({ srcStream: ACTIVE_ITEM_STREAM, dstProp: 'activeBoxIt', watching: true }),
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
