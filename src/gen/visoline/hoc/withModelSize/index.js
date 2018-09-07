import { compose, lifecycle, withState } from 'recompose';
import { omitProps } from 'libs/hoc';
import withHandlers from 'recompose/withHandlers';

const PROPS = {
  UPDATE_ITEM: '$$updateItem',
  ITEM_VALUE: '$$itemValue',
  SUBSCRIBE: '$$subscribe',
  UNSUBSCRIBE: '$$unsubscribe',
};

export const withModelSize = ({ model: Model, dstProp }) => {
  return compose(
    withState(dstProp, PROPS.UPDATE_ITEM, Model.size()),
    withHandlers(() => {
      let disposer;
      return {
        [PROPS.SUBSCRIBE]: (props) => () => {
          if (Model) {
            // unsubscribe first
            if (disposer) disposer();
            disposer = Model.onSizeChange((newSize) => {
              props[PROPS.UPDATE_ITEM](newSize);
            });
          }              
        },
        [PROPS.UNSUBSCRIBE]: () => () => {
          if (disposer) disposer(); 
        }
      }
    }),
    lifecycle({
      componentWillMount() {
        this.props[PROPS.SUBSCRIBE]();
      },
      componentWillUnmount() {
        this.props[PROPS.UNSUBSCRIBE]();
      },
    }),
    omitProps(Object.values(PROPS)),    
  )
}

export default withModelSize;
