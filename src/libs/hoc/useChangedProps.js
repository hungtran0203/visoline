import { withProps } from 'recompose';

export const useChangedProps = (propNames) => BaseComponent => {
  const prevPropValues = {};
  return withProps(
    (ownerProps) => {
      let found = false;
      let nextVal = false;
      propNames.map(propName => {
        if (!found && prevPropValues[propName] !== ownerProps[propName]) {
          nextVal = ownerProps[propName];
          found = true;
        }
        prevPropValues[propName] = ownerProps[propName];
        if (!found) {
          nextVal = ownerProps[propNames[0]];
        }
        return found;
      });
      return { [propNames[0]]: nextVal };
    }
  )(BaseComponent);
};
