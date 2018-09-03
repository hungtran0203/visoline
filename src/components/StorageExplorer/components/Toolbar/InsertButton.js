import React from 'react';
import Icon from '@material-ui/core/Icon';
import { compose, branch, renderNothing, withHandlers, withProps } from 'recompose';
import { withModel, withModelStream, withModelStreamProp } from 'libs/model/hoc';
import { ACTIVE_PAGE_STREAM } from 'constants';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import BoxModel from 'libs/editor/model/box';
import styles from './styles.scss';

export const InsertButton = compose(
  withModelStreamProp({ srcStream: ACTIVE_PAGE_STREAM, model: BoxModel, dstProp: 'activePageIt', watching: true }),
  withModelStreamProp({ srcStream: ACTIVE_ITEM_STREAM, model: BoxModel, dstProp: 'activeBoxIt', watching: true }),
  withHandlers({
    onClick: ({ activePageIt, activeBoxIt }) => () => {
      const targetBoxIt = activeBoxIt ? activeBoxIt : activePageIt;
      if (targetBoxIt) {
        const newBoxIt = BoxModel.new({ type: 'Box', name: 'New' });
        newBoxIt.parent.changeTo(targetBoxIt);
        targetBoxIt.children.push(newBoxIt);  
      }
    }
  }),
  withProps(({ activePageIt }) => ({
    disabled: !activePageIt,
  })),
)(
  ({ onClick }) => <div onClick={onClick} className={styles.btn} ><Icon>add</Icon>Insert</div>
);

export default InsertButton;
