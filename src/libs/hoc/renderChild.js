import React from 'react';
export const renderChild = ({ children }) => {
  const count = React.Children.count(children);
  return count > 1 ? <div>{children}</div> : children;
};
