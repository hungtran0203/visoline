import React from 'react';
import Icon from '@material-ui/core/Icon';

import { compose, branch, renderNothing, withHandlers } from 'recompose';
import { SHOW_PAGE_LIST_STREAM } from '../../constants';
import { withStreamProps } from 'libs/hoc';
import BoxModel from 'libs/editor/model/box';

import Header from '../Header';

const PageListPanel = compose(
  withStreamProps({
    showPageList: [SHOW_PAGE_LIST_STREAM, { init: true }],
  }),
  branch(({ showPageList }) => !showPageList, renderNothing),
  withHandlers({
    addPage: () => () => {
      const newPage = BoxModel.new({ name: 'NewPage', type: 'Box' });
      newPage.save();
    }
  })
  // itemBuilderEnhancers.withNewRootHandler('addPage'),
)(({ addPage }) => (
  <Header>
    <div>Pages</div>
    <div onClick={addPage}><Icon>add</Icon></div>
  </Header>

));

export default PageListPanel;
