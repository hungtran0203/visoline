import { withHandlers, compose } from 'recompose';
const rootRefIndex = '$$';
export const withRef = () => {
  return compose(
    withHandlers(() => {
      const refs = new Map();
      return {
        getRef: () => (key = rootRefIndex) => refs.get(key),
        ref: () => (key = rootRefIndex) => (ref) => refs.set(key, ref),
      };
    }),
  );
};
