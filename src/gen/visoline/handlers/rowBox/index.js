const handler = ({ activeBoxIt }) => () => {
  if (activeBoxIt) {
    activeBoxIt.set('component', 'Flex').save();
  }
};

export default handler;
