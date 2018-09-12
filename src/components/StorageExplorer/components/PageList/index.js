import React from 'react';
import PageListItem from '../PageListItem';
import classnames from 'classnames';

import { compose, branch, renderNothing } from 'recompose';
import { withStreamProps } from 'libs/hoc';

import BoxModel from 'gen/visoline/model/Box';
import withModelSize from 'gen/visoline/hoc/withModelSize';

import { SHOW_PAGE_LIST_STREAM } from '../../constants';
import styles from '../../styles.scss';

export const PageList = compose(
  withStreamProps({
    showPageList: [SHOW_PAGE_LIST_STREAM, { init: true }],
  }),
  branch(({ showPageList }) => !showPageList, renderNothing),
  withModelSize({ model: BoxModel, dstProp: 'boxCount' }),
)(({ boxCount }) => {
  return (
    <div className={classnames(styles.pageSelection)}>
      {
        BoxModel.findAll((boxIm) => !BoxModel.getInstance(boxIm).parent.toId()).map(pageIt => {
          return (
            <PageListItem key={pageIt.getRefId()} pageId={pageIt.getRefId()}/>
          )
        })
      }
    </div>
  )
});

export default PageList;