import BoxModel from 'libs/editor/model/box';

const DEFAULT_BOX_TYPE = 'Box';

export const doInsert = ({ activeItem$ }) => () => {
  const newBoxIt =  BoxModel.new({ type: DEFAULT_BOX_TYPE });
  const activeItem = activeItem$.get();
  const activeItemIt = BoxModel.getInstance(activeItem);
  if (activeItemIt && activeItemIt.isExists()) {
    newBoxIt.parent.changeTo(activeItem);
    activeItemIt.children.push(newBoxIt);
  }
};

export default doInsert;
