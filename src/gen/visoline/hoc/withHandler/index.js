import { withHandlers } from 'recompose';
import Registry from 'libs/Registry';

export const withHandler = ({ handlerName, handlerRefId }) => {
  const handler = Registry('HANDLER_CLASS').get(handlerRefId);
  return withHandlers({ [handlerName]: handler});
};

export default withHandler;
