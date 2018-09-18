import Registry from 'libs/Registry';
import React from 'react';
import { compose, withHandlers, withState, renderComponent, branch, renderNothing, withProps } from 'recompose';
import EditableText from 'components/EditableText';
import { Flex, Box } from 'reflexbox';
import styles from '../../styles.scss';
import classnames from 'classnames';
import Column from '../Column';
import Row from '../Row';
import { withStreamProps, withStreams, withUuid } from 'libs/hoc';
import Icon from '@material-ui/core/Icon';

const ACTIVE_ROW_STREAM = 'active.row.stream';

const LinkBtn = compose(
  withStreams({ activeNode$: 'activeNode.stream' }),
  withHandlers({
    onClick: ({ activeNode$, onSave }) => () => {
      const nodeId = activeNode$.get();
      if(nodeId) {
        onSave(`@${activeNode$.get()}`);
      }
    }
  })
)(
  ({ onClick }) => (<Icon onClick={onClick} className={classnames(styles.linkBtn)}>link</Icon>)
);

const displayFormatter = ({ type, id, name}) => name;

export const EditableRender = compose(
  withUuid(),
  withStreamProps({
    active: [ACTIVE_ROW_STREAM],
  }),
  withStreams({
    active$: [ACTIVE_ROW_STREAM],
  }),
  withHandlers({
    onSave: ({ prop, model }) => (value) => {
      model.set(prop, value).save();
    },
  }),
  withHandlers({
    onClick: ({ active$, getUuid }) => () => {
      active$.set(getUuid());
    }
  }),
  withProps(({ getUuid, active, value }) => ({
    isActive: (getUuid() === active),
    displayValue: Registry.refValueToString(value, displayFormatter),
  })),
)(({ prop, value, displayValue, onSave, onClick, isActive }) => {
  return (
    <Row key={prop} onClick={onClick} className={classnames({ [styles.activeRow]: isActive })}>
      <Column w={0.4} >{prop}</Column>
      <Column w={0.6} >
        <EditableText value={value} displayValue={displayValue} onSave={onSave}/>
      </Column>
      <LinkBtn onSave={onSave} />
    </Row>    
  )
});

export default EditableRender;