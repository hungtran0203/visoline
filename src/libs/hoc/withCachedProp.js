import { withProps } from 'recompose';
export const withCachedProp = (propName, shouldUpdate) => BaseComponent => {
  const cachedValues = new Map();
  return withProps(
    (ownerProps) => {
      const nextVal = ownerProps[propName];
      const prevVal = cachedValues.get(propName);
      let passVal;
      if (!cachedValues.has(propName)) {
        passVal = nextVal;
      } else {
        if (shouldUpdate(nextVal, prevVal)) {
          passVal = nextVal;
        } else {
          passVal = prevVal;
        }
      }
      cachedValues.set(propName, passVal);
      return { [propName]: passVal };
    }
  )(BaseComponent);
};
