import React from 'react';
import Icon from '@material-ui/core/Icon';
import { compose, withHandlers, withProps } from 'recompose';
import { ACTIVE_PAGE_STREAM } from 'constants';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';

import BoxModel from 'gen/visoline/model/Box';
import withModelStreamProp from 'gen/visoline/hoc/withModelStreamProp';
import styles from './styles.scss';

export const InsertButton = compose(
  withModelStreamProp({ srcStream: ACTIVE_PAGE_STREAM, dstProp: 'activePageIt', watching: true }),
  withModelStreamProp({ srcStream: ACTIVE_ITEM_STREAM, dstProp: 'activeBoxIt', watching: true }),
  withHandlers({
    onClick: ({ activePageIt, activeBoxIt }) => () => {
      const targetBoxIt = activeBoxIt ? activeBoxIt : activePageIt;
      if (targetBoxIt) {
        const newBoxIt = BoxModel.new({ component: 'Box', name: 'New' });
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
