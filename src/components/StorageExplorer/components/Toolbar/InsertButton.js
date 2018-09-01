import React from 'react';
import Icon from '@material-ui/core/Icon';
import { compose, branch, renderNothing, withHandlers, withProps } from 'recompose';
import { withModel, withModelStream, withModelStreamProp } from 'libs/model/hoc';
import { ACTIVE_PAGE_STREAM } from 'constants';
import BoxModel from 'libs/editor/model/box';
import styles from './styles.scss';

export const InsertButton = compose(
  withModelStreamProp({ srcStream: ACTIVE_PAGE_STREAM, model: BoxModel, dstProp: 'activePageIt', watching: true }),
  withHandlers({
    insertBox: ({ activePageIt }) => () => {
      if (activePageIt) {
        const newBoxIt = BoxModel.new({ type: 'Box', name: 'New' });
        newBoxIt.parent.changeTo(activePageIt);
        activePageIt.children.push(newBoxIt);  
      }
    }
  }),
  withProps(({ activePageIt }) => ({
    disabled: !activePageIt,
  })),
)(
  ({ insertBox }) => <div onClick={insertBox} className={styles.btn} ><Icon>add</Icon>Insert</div>
);

export default InsertButton;
