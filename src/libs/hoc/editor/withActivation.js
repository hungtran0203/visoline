import { compose, withProps, withHandlers } from 'recompose';
import classnames from 'classnames';
import _ from 'lodash';
import * as storage from 'libs/storage';
import { omitProps, withStreams, withStreamProps } from 'libs/hoc';
import { CTRL_KEY_STATE } from 'libs/hoc/editor';

export const ACTIVE_ITEM_STREAM = 'activeItem.stream';
export const ACTIVE_ELEMENT_STREAM = 'activeElement.stream';
export const MULT_SELECT_ELEMENT_STREAM = 'multSelectElement.stream';

const allRefs = {};

export const withActivation = (activationClass='isActivation', isSelectedClass='isSelected') => {
  return compose(
    withStreams({
      activationId$: [ACTIVE_ITEM_STREAM, { init: null }],
      activationEle$: [ACTIVE_ELEMENT_STREAM, { init: null }],
      ctrlKey$: CTRL_KEY_STATE,
      selection$: [MULT_SELECT_ELEMENT_STREAM],
    }),
    withStreamProps({ activationId: [ACTIVE_ITEM_STREAM, { init: null }] }),  
    withProps(({ className, item, activationId, selection$ }) => {
      const itemIm = storage.getItem(item);
      const activationIm = storage.getItem(activationId);
      const selection = selection$.get() || [];
      const selectionIds = selection.map(el => storage.getItemId(el));
      return { 
        className: classnames(className, {
          [activationClass]: itemIm === activationIm,
          [isSelectedClass]: _.includes(selectionIds, storage.getItemId(itemIm)),
        }),
      };
    }),
    withHandlers({
      onClick: ({ item, activationId$, activationEle$, ctrlKey$, selection$ }) => (e) => {
        const itemIm = storage.getItem(item);
        activationEle$.set(e.target);
        e.stopPropagation();
        const prevItem = activationId$.get();

        // allow multiple selection
        if (prevItem && ctrlKey$.get()) {
          const selection = selection$.get() || [];
          selection.push(prevItem);
          selection$.set(selection);
        }

        activationId$.set(itemIm.get('id'));
        return false;
      },
    
    }),
    omitProps(['activationId', 'activationId$', 'activationEle$', 'ctrlKey$', 'selection$']),
  )
};
