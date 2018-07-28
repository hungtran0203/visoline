import { withHandlers, compose } from 'recompose';
const rootRefIndex = '$$';
export const withRef = () => {
  const refs = new Map();
  return compose(
    withHandlers({
      getRef: () => (key = rootRefIndex) => refs.get(key),
      ref: () => (key = rootRefIndex) => (ref) => refs.set(key, ref),
    }),
  );
};
