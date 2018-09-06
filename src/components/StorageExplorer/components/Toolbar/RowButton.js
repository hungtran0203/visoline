import React from 'react';
import Icon from '@material-ui/core/Icon';
import { compose, withHandlers, withProps } from 'recompose';
import { withModelStreamProp } from 'libs/model/hoc';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import styles from './styles.scss';

export const RowButton = compose(
  withModelStreamProp({ srcStream: ACTIVE_ITEM_STREAM, dstProp: 'activeBoxIt', watching: true }),
  withHandlers({
    onClick: ({ activeBoxIt }) => () => {
      if (activeBoxIt) {
        activeBoxIt.set('type', 'Flex').save();
      }
    }
  }),
  withProps(({ activeBoxIt }) => ({
    disabled: !activeBoxIt,
  })),
)(
  ({ onClick }) => <div onClick={onClick} className={styles.btn} ><Icon>view_stream</Icon>Row</div>
);

export default RowButton;
