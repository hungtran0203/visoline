import { lifecycle, compose, withProps } from 'recompose';
import { withStreams } from './withStreams';

export const withStreamProps = (config) => BaseComponent => {
  const streamProps = Object.keys(config);
  const unsub = {};
  const props = {};
  const hoc = compose(
    withStreams(config),
    lifecycle({
      componentWillMount() {
        const refresh = () => this.setState({ refresh: {} });
        streamProps.map(prop => {
          unsub[prop] = this.props[prop].subscribe(refresh);
          return prop;
        });
      },
      componentWillUnmount() {
        streamProps.map(prop => unsub[prop]());
      },
    }),
    withProps((ownerProps) => {
      streamProps.map(key => (props[key] = ownerProps[key].get()));
      return props;
    }),
  );
  return hoc(BaseComponent);
};

export default withStreamProps;
