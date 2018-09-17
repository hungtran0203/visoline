import _ from 'lodash';

const handler = ({ selectedBoxes$, activeBoxIt }) => () => {
  const selectedBoxes = selectedBoxes$.get();
  if (activeBoxIt && _.get(selectedBoxes, 'length')) {
    const parentIt = activeBoxIt.parent.toIt();
    const BoxModel = activeBoxIt.constructor;
    const groupBoxIt = BoxModel.new({ name: 'Group', component: 'Box'});
    [...selectedBoxes, activeBoxIt.getId()].map(boxId => {
      const boxIt = BoxModel.getInstance(boxId);
      const parentId = boxIt.parent.toId();
      if (parentId) {
        boxIt.parent.toIt().children.remove(boxIt);
      }
      boxIt.parent.changeTo(groupBoxIt);
      groupBoxIt.children.push(boxIt);
    });
    parentIt.sync();
    groupBoxIt.parent.changeTo(parentIt);
    parentIt.children.push(groupBoxIt);
  }
};

export default handler;
