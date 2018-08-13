import React from 'react';
import { Flex, Box } from 'reflexbox';
import styles from './styles.scss';
import classnames from 'classnames';
import { compose, withState, branch, withHandlers,
  renderComponent, withStateHandlers, withProps,
} from 'recompose';
import KEYCODES from 'libs/constants/keycodes';
import { withComposedHandlers, useChangedProps, withStreams } from 'libs/hoc';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import storage from 'libs/storage';

const InputFieldUI = (props) => {
  return (
    <Box auto>
      <input {...props} className={classnames(styles.input, styles.text, props.className)}/>
    </Box>
  );
};

const InputField = compose(
  withStateHandlers(
    ({ value }) => ({ newValue: value }),
    {
      changeValueStr: ({ newValue }) => (value) => {
        return { newValue: value };
      },
    },
  ),
  withComposedHandlers({
    onChange: ({ newValue, changeValueStr }) => (event) => {
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
  useChangedProps(['value', 'newValue']),
)(InputFieldUI);

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
    <div onDoubleClick={onStartEdit} className={classnames(className)}>{value}</div>
  )
});

export default EditableText;