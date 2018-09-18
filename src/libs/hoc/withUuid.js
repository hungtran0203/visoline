import { withHandlers, compose } from 'recompose';
import uuid from 'uuid';

export const withUuid = () => {
  return compose(
    withHandlers(() => {
      const refs = new Map();
      const id = uuid();
      return {
        getUuid: () => () => id,
      };
    }),
  );
};
