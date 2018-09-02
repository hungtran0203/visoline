import React from 'react';
import Icon from '@material-ui/core/Icon';
import { compose, branch, renderNothing, withHandlers, withProps } from 'recompose';
import { withModel, withModelStream, withModelStreamProp } from 'libs/model/hoc';
import { ACTIVE_PAGE_STREAM } from 'constants';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import BoxModel from 'libs/editor/model/box';
import styles from './styles.scss';

export const AppendButton = compose(
  withModelStreamProp({ srcStream: ACTIVE_ITEM_STREAM, model: BoxModel, dstProp: 'activeBoxIt', watching: true }),
  withHandlers({
    onClick: ({ activeBoxIt }) => () => {
      if (activeBoxIt) {
        const newBoxIt = activeBoxIt.constructor.new({ type: 'Box', name: 'New' });
        const parentIt = activeBoxIt.parent.toIt();
        newBoxIt.parent.changeTo(parentIt);
        parentIt.children.push(newBoxIt);  
      }
    }
  }),
  withProps(({ activeBoxIt }) => ({
    disabled: !activeBoxIt,
  })),
)(
  ({ onClick }) => <div onClick={onClick} className={styles.btn} ><Icon>add</Icon>Append</div>
);

export default AppendButton;
