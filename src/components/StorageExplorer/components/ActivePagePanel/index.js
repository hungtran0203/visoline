import React from 'react';
import Icon from '@material-ui/core/Icon';
import { ACTIVE_PAGE_STREAM } from 'constants';
import { compose, branch, renderNothing, withHandlers } from 'recompose';
import { SHOW_PAGE_LIST_STREAM } from '../../constants';
import { withStreamProps, withStreams } from 'libs/hoc';
import { withModel, withModelStream, withModelStreamProp } from 'libs/model/hoc';

import BoxModel from 'libs/editor/model/box';

import Header from '../Header';
import { Flex } from 'reflexbox';

export const ActivePagePanel = compose(
  withModelStreamProp({ srcStream: ACTIVE_PAGE_STREAM, model: BoxModel, dstProp: 'activePageIt', watching: true }),
  branch(
    ({ activePageIt }) => !activePageIt,
    renderNothing,
  ),
  withStreams({
    showPageList$: [SHOW_PAGE_LIST_STREAM, { init: true }],
  }),
  withStreamProps({
    showPageList: [SHOW_PAGE_LIST_STREAM, { init: true }],
  }),
  withHandlers({
    togglePageList: ({ showPageList$ }) => () => showPageList$.set(!showPageList$.get()),
  })
)(({ activePageIt, togglePageList, showPageList, insertBox }) => {
  return (
    <Header>
      <div>{activePageIt.getOneOf(['name', 'id'])}</div>
      <Flex>
        <div onClick={togglePageList}>
          {
            !!showPageList ?
              <Icon>expand_less</Icon>:
              <Icon>expand_more</Icon>
          }
        </div>
      </Flex>
    </Header>
  );
});

export default ActivePagePanel;
