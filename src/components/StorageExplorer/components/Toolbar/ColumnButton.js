import React from 'react';
import Icon from '@material-ui/core/Icon';
import { compose, branch, renderNothing, withHandlers, withProps } from 'recompose';
import withModelStream from 'gen/visoline/hoc/withModelStream';
import withModelStreamProp from 'gen/visoline/hoc/withModelStreamProp';
import { ACTIVE_PAGE_STREAM } from 'constants';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import styles from './styles.scss';

export const ColumnButton = compose(
  withModelStreamProp({ srcStream: ACTIVE_ITEM_STREAM, dstProp: 'activeBoxIt', watching: true }),
  withHandlers({
    onClick: ({ activeBoxIt }) => () => {
      if (activeBoxIt) {
        activeBoxIt.set('component', 'Box').save();
      }
    }
  }),
  withProps(({ activeBoxIt }) => ({
    disabled: !activeBoxIt,
  })),
)(
  ({ onClick }) => <div onClick={onClick} className={styles.btn} ><Icon>view_column</Icon>Column</div>
);

export default ColumnButton;
