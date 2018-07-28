import { compose, withProps } from 'recompose';
import classnames from 'classnames';
import * as storage from 'libs/storage';
import { omitProps, withStreams, withStreamProps } from 'libs/hoc';

export const ACTIVE_ITEM_STREAM = 'activeItem.stream';
export const ACTIVE_ELEMENT_STREAM = 'activeElement.stream';

const allRefs = {};

export const withActivation = (activationClass='isActivation') => {
  return compose(
    withStreams({
      activationId$: [ACTIVE_ITEM_STREAM, { init: null }],
      activationEle$: [ACTIVE_ELEMENT_STREAM, { init: null }]
    }),
    withStreamProps({ activationId: [ACTIVE_ITEM_STREAM, { init: null }] }),  
    withProps(({ className, item, activationId, activationId$, activationEle$ }) => {
      const itemIm = storage.getItem(item);
      const activationIm = storage.getItem(activationId);
      return { 
        className: classnames(className, { [activationClass]: itemIm === activationIm }),
        onClick: (e) => {
          activationEle$.set(e.target);
          e.stopPropagation();
          activationId$.set(itemIm.get('id'));
          return false;
        },
      };
    }),
    omitProps(['activationId', 'activationId$', 'activationEle$']),
  )
};
