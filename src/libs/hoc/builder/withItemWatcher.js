import { compose, lifecycle, withHandlers, withState, withPropsOnChange } from 'recompose';
import { subscribe } from 'libs/storage';
import { useChangedProps, omitProps } from 'libs/hoc';

const PROPS = {
  SUBSCRIBE: '$$addListener',
  UPDATE_ITEM: '$$updateItem',
  ITEM_VALUE: '$$itemValue',
};

const disposers = new WeakMap();

export const withItemWatcher = (itemName='item') => compose(
  withHandlers({ [PROPS.SUBSCRIBE]: subscribe }),
  withState(PROPS.ITEM_VALUE, PROPS.UPDATE_ITEM, ''),
  lifecycle({
    componentWillMount() {
      const disposer = this.props[PROPS.SUBSCRIBE]((newVal, oldVal) => {
        this.props[PROPS.UPDATE_ITEM](newVal);
      });
      disposers.set(this, disposer);
    },
    componentWillUnmount() {
      const disposer = disposers.get(this);
      if (disposer) {
        disposer();
      }
    },
  }),
  useChangedProps([itemName, PROPS.ITEM_VALUE]),
  omitProps(Object.values(PROPS)),
);
