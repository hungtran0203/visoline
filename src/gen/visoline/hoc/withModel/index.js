import { compose, lifecycle, withState, withPropsOnChange } from 'recompose';
import { omitProps } from 'libs/hoc';
import withHandlers from 'recompose/withHandlers';
import register from 'libs/Registry';

const PROPS = {
  UPDATE_ITEM: '$$updateItem',
  ITEM_VALUE: '$$itemValue',
  SUBSCRIBE: '$$subscribe',
  UNSUBSCRIBE: '$$unsubscribe',
};

export const withModel = ({ srcProp='id', model: Model, dstProp, watching=false }) => {
  const hocs = [];
  hocs.push(withPropsOnChange([srcProp], (props) => {
    const id = props[srcProp];
    if(id && dstProp) {
      const modelIt = register('MODEL_CLASS').resolveById(id, Model);
      return {
        [dstProp]: ((modelIt && modelIt.isExists()) ? modelIt : null),
      }
    }
    return {};
  }));
  if (watching) {
    hocs.splice(0, 0, withState(PROPS.ITEM_VALUE, PROPS.UPDATE_ITEM, ''));
    hocs.push(
      withHandlers(() => {
        let disposer;
        return {
          [PROPS.SUBSCRIBE]: (props) => (modelIt) => {
            if (modelIt) {
              // unsubscribe first
              if (disposer) disposer();
              disposer = modelIt.subscribe((newVal, oldVal) => {
                props[PROPS.UPDATE_ITEM](newVal);
              });
            }              
          },
          [PROPS.UNSUBSCRIBE]: () => () => {
            if (disposer) disposer(); 
          }
        }
      }),
      withPropsOnChange([dstProp], (props) => {
        props[PROPS.UNSUBSCRIBE]();
        props[PROPS.SUBSCRIBE](props[dstProp]);
        return {};
      }),
      lifecycle({
        componentWillMount() {
          this.props[PROPS.SUBSCRIBE](this.props[dstProp]);
        },
        componentWillUnmount() {
          this.props[PROPS.UNSUBSCRIBE]();
        },
      }),
      omitProps(Object.values(PROPS)),
    )
  }
  return hocs.length === 1 ? hocs[0] : compose(...hocs);
};

export default withModel;
