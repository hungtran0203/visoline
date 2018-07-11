import { withProps } from 'recompose';
import { getStream } from './stream';

export const withStreams = (config) => BaseComponent => {
  const propsCreator = (ownerProps) => {
    const props = {};
    Object.keys(config).map(prop => {
      const streamName = typeof config[prop] === 'function' ? config[prop](ownerProps) : config[prop];
      props[prop] = getStream(streamName);
      return prop;
    });
    return props;
  };
  return withProps(propsCreator)(BaseComponent);
};

export default withStreams;
