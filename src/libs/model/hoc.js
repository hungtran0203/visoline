import { compose, lifecycle, withState, withProps, withPropsOnChange } from 'recompose';
import { omitProps, withStreamProps, withStreams } from 'libs/hoc';
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

export const withModelStreamProp = ({ srcStream, model: Model, dstProp, watching=false }) => {
  const STREAM_VALUE_PROP = '$$streamValue';
  return compose(
    withStreamProps({
      [STREAM_VALUE_PROP]: [srcStream, { init: null }],
    }),
    withModel({
      srcProp: STREAM_VALUE_PROP, model: Model, dstProp, watching
    }),
    omitProps(Object.values([STREAM_VALUE_PROP])),
  )
};

export const withModelStream = ({ srcStream, model: Model, dstProp }) => {
  const STREAM_VALUE_PROP = '$$streamValue$';
  return compose(
    withStreams({
      [STREAM_VALUE_PROP]: [srcStream, { init: null }],
    }),
    withProps((props) => ({
      [dstProp]: {
        get: () => {
          const stream$ = props[STREAM_VALUE_PROP];
          return Model.getInstance(stream$.get());
        },
        set: (value) => props[STREAM_VALUE_PROP].set(value),
      }
    })),
    omitProps(Object.values([STREAM_VALUE_PROP])),
  )
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
