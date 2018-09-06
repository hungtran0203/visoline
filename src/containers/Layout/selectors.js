import BoxModel from 'gen/visoline/model/Box';

export const selectBackground = (unsetVal = '#fff') => ({ activeItem$ }) => {
  let backgroundColor = unsetVal;
  const activeItem = activeItem$.get();
  if (activeItem) {
    const itemIt = BoxModel.getInstance(activeItem);
    backgroundColor = itemIt.getIn(['style', 'backgroundColor']);
  }
  return backgroundColor;
};
