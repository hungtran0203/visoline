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

export const UnGroupButton = compose(
  withModelStreamProp({ srcStream: ACTIVE_PAGE_STREAM, dstProp: 'activePageIt', watching: true }),
  withModelStreamProp({ srcStream: ACTIVE_ITEM_STREAM, dstProp: 'activeBoxIt', watching: true }),

  withHandlers({
    onClick: ({ activeBoxIt }) => () => {
      if (activeBoxIt && activeBoxIt.children.toId().length) {
        const parentIt = activeBoxIt.parent.toIt();
        const children = activeBoxIt.children.toIt();
        children.map(childIt => {
          childIt.parent.changeTo(parentIt);
          if(parentIt) {
            parentIt.children.push(childIt);
          }
        });
        if(parentIt) {
          parentIt.children.remove(activeBoxIt);
        }
        activeBoxIt.delete();
      }
    }
  }),
  withProps(({ activeBoxIt }) => ({
    disabled: !activeBoxIt,
  })),
)(
  ({ onClick }) => <div onClick={onClick} className={styles.btn} ><Icon>add</Icon>UnGroup</div>
);

export default UnGroupButton;
