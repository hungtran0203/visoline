import Item from 'libs/storage/item';
import * as listHelper from 'libs/immutable/list';

export const doUnGroup = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  const itemIt = Item.getInstance(activeItem);
  if (itemIt) {
    const parentIt = itemIt.parent.toIt();
    const childrenIt = itemIt.children.toIt();
    if (parentIt.isExists() && childrenIt.length) {
      const children = listHelper.replace(parentIt.getChildren(Item.FORMAT_IM), itemIt.getId(), ...childrenIt.map(childIt => childIt.toJS()));
      parentIt.children.changeTo(children);
      childrenIt.map(childIt => childIt.parent.changeTo(parentIt.getId()));
      itemIt.children.clear();
      itemIt.delete();
    }
  }
};
