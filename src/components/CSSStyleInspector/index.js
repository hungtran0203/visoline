import React from 'react';
import { Flex, Box } from 'reflexbox';
import styles from './styles.scss';
import classnames from 'classnames';
import { compose, withState, branch, withHandlers,
  renderComponent, withStateHandlers, withProps,
} from 'recompose';
import KEYCODES from 'libs/constants/keycodes';
import { useChangedProps, withStreams } from 'libs/hoc';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import * as storage from 'libs/storage';

export const CSSStyleInspector = ({ element }) => {
  const cs = window.getComputedStyle(element,null);
  const paddingProps = {
    left: cs.getPropertyValue('padding-left'),
    right: cs.getPropertyValue('padding-right'),
    top: cs.getPropertyValue('padding-top'),
    bottom: cs.getPropertyValue('padding-bottom'),
    label: 'padding',
  }
  const marginProps = {
    left: cs.getPropertyValue('margin-left'),
    right: cs.getPropertyValue('margin-right'),
    top: cs.getPropertyValue('margin-top'),
    bottom: cs.getPropertyValue('margin-bottom'),
    label: 'margin',
  };
  const borderProps = {
    left: cs.getPropertyValue('border-left-width'),
    right: cs.getPropertyValue('border-right-width'),
    top: cs.getPropertyValue('border-top-width'),
    bottom: cs.getPropertyValue('border-bottom-width'),
    label: 'border',
  };
  const size = `${cs.getPropertyValue('width')} x ${cs.getPropertyValue('height')}`;
  return (
   <Flex column className={classnames(styles.container)}>
    <Flex className={classnames(styles.layoutView)} justify="center" align="center">
      <Boxing className={classnames(styles.margin)} {...marginProps}>
        <Boxing className={classnames(styles.border)} {...borderProps}>
          <Boxing className={classnames(styles.padding)} {...paddingProps}>
            <div className={classnames(styles.content)} >
              {size}
            </div>
          </Boxing>
        </Boxing>
      </Boxing>
    </Flex>
   </Flex> 
  );
};

export const Boxing = ({ className, children, label, left, right, top, bottom }) => (
  <Flex className={classnames(styles.boxing, className)} auto>
    <div className={classnames(styles.label)} >{label}</div>
    <Flex className={classnames(styles.left, styles.centering)}>
      <EditableText value={left} />
    </Flex>
    <Flex className={classnames(styles.middle)} column auto>
      <Flex className={classnames(styles.top, styles.centering)}>
        <EditableText value={top} />
      </Flex>
      <Flex className={classnames(styles.center, styles.centering)} auto>
        {children}
      </Flex>
      <Flex className={classnames(styles.bottom, styles.centering)}>
      <EditableText value={bottom} />
      </Flex>
    </Flex>
    <Flex className={classnames(styles.right, styles.centering)} align="center">
      <EditableText value={right} />
    </Flex>
  </Flex>
);

const InputFieldUI = (props) => {
  return (
    <Box w={50}>
      <input {...props} className={classnames(styles.input, styles.text, props.className)}/>
    </Box>
  );
};

const changeValue = (value, delta) => {
  return `${parseInt(value) + delta}px`;
}

const InputField = compose(
  withStateHandlers(
    ({ value }) => ({ newValue: value }),
    {
      changeValue: ({ newValue }) => (delta = 1) => ({ newValue: changeValue(newValue, delta)}),
      changeValueStr: ({ newValue }) => (value) => {
        return { newValue: value };
      },
    },
  ),
  withHandlers({
    onKeyDown: ({ changeValue, onDoneEdit, ...props }) => (event) => {
      const { altKey, charCode, ctrlKey, keyCode, shiftKey} = event;
      switch (event.keyCode) {
        case KEYCODES.UP_ARROW:
          changeValue(1);
          break;
        case KEYCODES.DOWN_ARROW:
          changeValue(-1);
          break;
        case KEYCODES.ENTER:
          onDoneEdit(props.newValue);
          break;
        default:
          return false;
      }
      event.preventDefault();
      event.stopPropagation();
    },
    onChange: ({ newValue, changeValueStr, onChangeAttr, ...rest }) => (event) => {
      const newValue = event.target.value;
      changeValueStr(newValue);
      onChangeAttr(newValue);
      console.log('restrestrest', rest, newValue);
      return false;
    },
  }),
  withProps({
    autoFocus: true,
  }),
  useChangedProps(['value', 'newValue']),
)(InputFieldUI);

const EditableText = compose(
  withStreams({
    activeItem$: [ACTIVE_ITEM_STREAM, { init: null }],
  }),  
  withHandlers({
    onChangeAttr: ({ activeItem$ }) => (value) => {
      const activeItem = storage.getItem(activeItem$.get());
      storage.updateItem(activeItem.setIn(['style', 'marginTop'], value));
    },
  }),
  withState('isEditing', 'toggleEditing', false),
  withHandlers({
    onStartEdit: (props) => () => { props.toggleEditing(true); },
    onDoneEdit: (props) => () => { props.toggleEditing(false); },
  }),
  branch(
    ({ isEditing }) => !!isEditing,
    renderComponent(InputField),
  ),
)(({ value, onStartEdit }) => {
  return (
    <div onClick={onStartEdit} >{value}</div>
  )
});

export default CSSStyleInspector;
