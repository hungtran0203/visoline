import { compose, lifecycle, withHandlers, withState, withPropsOnChange } from 'recompose';
import { useChangedProps, omitProps } from 'libs/hoc';
import Storage from 'libs/storage/Storage';
const PROPS = {
  SUBSCRIBE: '$$addListener',
  UPDATE_ITEM: '$$updateItem',
  ITEM_VALUE: '$$itemValue',
};

const disposers = new WeakMap();

export const withItemWatcher = (itemName='item', domain='item') => compose(
  withHandlers({ [PROPS.SUBSCRIBE]: Storage.domain(domain).subscribe }),
  withState(PROPS.ITEM_VALUE, PROPS.UPDATE_ITEM, ''),
  lifecycle({
    componentWillMount() {
      const disposer = this.props[PROPS.SUBSCRIBE]((newVal, oldVal) => {
        this.props[PROPS.UPDATE_ITEM](newVal);
      }, itemName);
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
