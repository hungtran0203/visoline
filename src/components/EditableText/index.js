import React from 'react';
import { Flex, Box } from 'reflexbox';
import styles from './styles.scss';
import classnames from 'classnames';
import { compose, withState, branch, withHandlers,
  renderComponent, withProps, withPropsOnChange,
} from 'recompose';
import KEYCODES from 'libs/constants/keycodes';
import { withComposedHandlers, useChangedProps, withStreams, omitProps } from 'libs/hoc';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import _ from 'lodash';

const InputFieldUI = compose(
  omitProps(['changeValueStr', 'newValue', 'changedValues', 'onDoneEdit', 'onStartEdit', 'onSave', 'isEditing', 'toggleEditing', 'setNewValue']),
)((props) => {
  return (
    <Box auto>
      <input {...props} className={classnames(styles.input, styles.text, props.className)}/>
    </Box>
  );
});

const InputField = compose(
  withProps(() => ({ changedValues: [] })),
  withState('newValue', 'setNewValue'),
  withHandlers(() => {
    return ({
      changeValueStr: ({ changedValues, newValue, setNewValue }) => (value) => {
        changedValues[0] = value;
        setNewValue(value);
      },      
    })
  }),
  withComposedHandlers({
    onChange: ({ changeValueStr }) => (event) => {
      const newValue = event.target.value;
      changeValueStr(newValue);
      return false;
    },
    onBlur: ({ onDoneEdit }) => () => onDoneEdit(),
    onKeyDown: ({ onDoneEdit, onSave, ...props }) => (event) => {
      const { altKey, charCode, ctrlKey, keyCode, shiftKey} = event;
      switch (event.keyCode) {
        case KEYCODES.ENTER:
          onDoneEdit(props.newValue);
          if (onSave) {
            onSave(props.newValue);
          }
          break;
        default:
          return false;
      }
      event.preventDefault();
      event.stopPropagation();
    },
  }),
  withProps({
    autoFocus: true,
  }),
  withProps(({ changedValues, value }) => ({
    value: changedValues.length ? changedValues[0] : value,
  })),
)(InputFieldUI);

const EmptyText = () => <span>&#8203;</span>
export const EditableText = compose(
  withState('isEditing', 'toggleEditing', false),
  withHandlers({
    onStartEdit: (props) => () => { props.toggleEditing(true); },
    onDoneEdit: (props) => () => { props.toggleEditing(false); },
  }),
  branch(
    ({ isEditing }) => !!isEditing,
    renderComponent(InputField),
  ),
)(({ value, onStartEdit, className }) => {
  return (
    <div onDoubleClick={onStartEdit} className={classnames(className, styles.text)}>{value || <EmptyText />}</div>
  )
});

export default EditableText;