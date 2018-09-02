import React from 'react';
import Icon from '@material-ui/core/Icon';
import { compose, branch, renderNothing, withHandlers, withProps } from 'recompose';
import { withModel, withModelStream, withModelStreamProp } from 'libs/model/hoc';
import { ACTIVE_PAGE_STREAM } from 'constants';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import BoxModel from 'libs/editor/model/box';
import styles from './styles.scss';

export const DeleteButton = compose(
  withModelStreamProp({ srcStream: ACTIVE_ITEM_STREAM, model: BoxModel, dstProp: 'activeBoxIt', watching: true }),
  withHandlers({
    onClick: ({ activeBoxIt }) => () => {
      if (activeBoxIt) {
        activeBoxIt.parent.toIt().children.remove(activeBoxIt);
        activeBoxIt.delete();
      }
    }
  }),
  withProps(({ activeBoxIt }) => ({
    disabled: !activeBoxIt,
  })),
)(
  ({ onClick }) => <div onClick={onClick} className={styles.btn} ><Icon>remove</Icon>Delete</div>
);

export default DeleteButton;
