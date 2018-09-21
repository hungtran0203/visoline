const handler = () => ({ itemBuilder }) => (children) => {
  const list = [1,2,3,4,5];
  const itemId = children.toJS()[0];
  if (itemId) {
    return list.map((child, index) => {
      return itemBuilder({ ...child, key: `${itemId}-${index}` })(itemId);
    });  
  }
  return null;
};

export default handler;
