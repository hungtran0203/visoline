const handler = ({ activeBoxIt }) => () => {
  if (activeBoxIt) {
    activeBoxIt.set('component', 'Box').save();
  }
};

export default handler;
