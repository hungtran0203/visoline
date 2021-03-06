import React from 'react';
import EditableText from 'components/EditableText';
import classnames from 'classnames';
import { ACTIVE_PAGE_STREAM } from 'constants';

import { compose, withHandlers, withProps } from 'recompose';
import styles from '../../styles.scss';

import BoxModel from 'gen/visoline/model/Box';
import withModel from 'gen/visoline/hoc/withModel';
import withModelStream from 'gen/visoline/hoc/withModelStream';
import withModelStreamProp from 'gen/visoline/hoc/withModelStreamProp';

export const PageListItem = compose(
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
)(({ pageIt, onClick, isActive, onSaveName, pageId }) => {
  return (
    <div className={classnames(styles.row, styles.rootItem, { [styles.isActive]: isActive })} onClick={onClick}>
      <EditableText value={pageIt.getOneOf(['name', 'id'])} onSave={onSaveName}/>
    </div>
  )
});

export default PageListItem;
