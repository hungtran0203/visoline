import React from 'react';
import EditableText from 'components/EditableText';
import classnames from 'classnames';
import { ACTIVE_PAGE_STREAM } from 'constants';

import { compose, withHandlers, withProps } from 'recompose';
import styles from '../../styles.scss';

import BoxModel from 'gen/visoline/model/Box';
import { withModel, withModelStream, withModelStreamProp } from 'libs/model/hoc';

export const PageListItem = compose(
  // withItemItOrNothing,
  // withRootItem(),
  // withRootItem$(),
  // withItemIt(),
  // withItemIt('rootItemIt', 'rootItem'),
  withModelStream({ srcStream: ACTIVE_PAGE_STREAM, model: BoxModel, dstProp: 'activePage$' }),
  withModelStreamProp({ srcStream: ACTIVE_PAGE_STREAM, dstProp: 'activePageIt' }),
  withModel({ srcProp: 'pageId', dstProp: 'pageIt', watching: true }),
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
