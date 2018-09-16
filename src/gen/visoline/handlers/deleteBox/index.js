const handler = ({ activeBoxIt }) => () => {
  if (activeBoxIt) {
    activeBoxIt.parent.toIt().children.remove(activeBoxIt);
    activeBoxIt.delete();
  }
};

export default handler;
