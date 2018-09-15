const handler = ({ activeBoxIt }) => () => {
  console.log('asmdmsdma', activeBoxIt)
  if (activeBoxIt) {
    const newBoxIt = activeBoxIt.constructor.new({ component: 'Box', name: 'New' });
    const parentIt = activeBoxIt.parent.toIt();
    newBoxIt.parent.changeTo(parentIt);
    parentIt.children.push(newBoxIt);  
  }
};

export default handler;
