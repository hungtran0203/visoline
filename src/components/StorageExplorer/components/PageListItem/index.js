import React from 'react';
import Icon from '@material-ui/core/Icon';
import EditableText from 'components/EditableText';
import classnames from 'classnames';
import { ACTIVE_PAGE_STREAM } from 'constants';

import { compose, branch, renderNothing, withHandlers, withProps } from 'recompose';
import { SHOW_PAGE_LIST_STREAM } from '../../constants';
import { withStreamProps } from 'libs/hoc';
import styles from '../../styles.scss';

import BoxModel from 'libs/editor/model/box';
import { withModel, withModelStream, withModelStreamProp } from 'libs/model/hoc';

export const PageListItem = compose(
  // withItemItOrNothing,
  // withRootItem(),
  // withRootItem$(),
  // withItemIt(),
  // withItemIt('rootItemIt', 'rootItem'),
  withModelStream({ srcStream: ACTIVE_PAGE_STREAM, model: BoxModel, dstProp: 'activePage$' }),
  withModelStreamProp({ srcStream: ACTIVE_PAGE_STREAM, model: BoxModel, dstProp: 'activePageIt' }),
  withModel({ srcProp: 'pageId', model: BoxModel, dstProp: 'pageIt', watching: true }),
  withHandlers({
    onClick: ({ activePage$, pageId }) => () => activePage$.set(pageId),
    onSaveName: ({ pageIt }) => (name) => {
      pageIt.set('name', name).save();
    },
  }),
  withProps(({ activePageIt, pageIt }) => ({
    isActive: activePageIt && pageIt && activePageIt.getId() === pageIt.getId(),
  }))
  // withItemWatcher(),
)(({ pageIt, onClick, isActive, onSaveName }) => {
  return (
    <div className={classnames(styles.row, styles.rootItem, { [styles.isActive]: isActive })} onClick={onClick}>
      <EditableText value={pageIt.getOneOf(['name', 'id'])} onSave={onSaveName}/>
    </div>
  )
});

export default PageListItem;
