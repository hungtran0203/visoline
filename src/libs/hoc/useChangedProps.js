import React from 'react';

const propsStore = new WeakMap();
const getPrevPropValues = (ins) => {
  if (!propsStore.has(ins)) {
    propsStore.set(ins, {});
  }
  return propsStore.get(ins);
};

export const useChangedProps = (propNames) => BaseComponent => class WrapperComponent extends React.PureComponent {
  passingProps = () => {
    const prevPropValues = getPrevPropValues(this);
    const { props: ownerProps } = this;
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
    return { ...ownerProps, [propNames[0]]: nextVal };
  }

  render() {
    return <BaseComponent {...this.passingProps()} />;
  }
};
