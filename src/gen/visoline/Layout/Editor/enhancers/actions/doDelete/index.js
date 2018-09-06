import BoxModel from 'gen/visoline/model/Box';

export const doDelete = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  const activeItemIt = BoxModel.getInstance(activeItem);
  if (activeItemIt && activeItemIt.isExists()) {
    activeItemIt.parent.toIt().children.remove(activeItemIt);
    activeItemIt.delete();
  }
};