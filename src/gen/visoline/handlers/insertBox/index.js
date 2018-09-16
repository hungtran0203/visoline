
const handler = ({ activePageIt, activeBoxIt }) => () => {
  const targetBoxIt = activeBoxIt ? activeBoxIt : activePageIt;
  if (targetBoxIt) {
    const BoxModel = targetBoxIt.constructor;
    const newBoxIt = BoxModel.new({ component: 'Box', name: 'New' });
    newBoxIt.parent.changeTo(targetBoxIt);
    targetBoxIt.children.push(newBoxIt);  
  }
};

export default handler;
