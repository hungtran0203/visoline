import React from 'react';
import Icon from '@material-ui/core/Icon';
import { compose, withHandlers, withProps } from 'recompose';
import withModelStreamProp from 'gen/visoline/hoc/withModelStreamProp';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';

import styles from './styles.scss';

export const AppendButton = compose(
  withModelStreamProp({ srcStream: ACTIVE_ITEM_STREAM, dstProp: 'activeBoxIt', watching: true }),
  withHandlers({
    onClick: ({ activeBoxIt }) => () => {
      if (activeBoxIt) {
        const newBoxIt = activeBoxIt.constructor.new({ component: 'Box', name: 'New' });
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
