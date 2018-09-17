import _ from 'lodash';

const handler = ({ activeBoxIt }) => () => {
  if (activeBoxIt && activeBoxIt.children.toId().length) {
    const parentIt = activeBoxIt.parent.toIt();
    const children = activeBoxIt.children.toIt();
    children.map(childIt => {
      childIt.parent.changeTo(parentIt);
      if(parentIt) {
        parentIt.children.push(childIt);
      }
    });
    if(parentIt) {
      parentIt.children.remove(activeBoxIt);
    }
    activeBoxIt.delete();
  }
};

export default handler;
