import storage from 'libs/storage';

export const deleteBox = (item) => {
  const itemIm = storage.isItemId(item) ? storage.getItemFromId(item) : item;
  const parentId = itemIm.get('parentId');
  const parentIm = storage.getItem(parentId);
  const newChildren = parentIm.get('children').filter((child) => child !== itemIm.get('id'));
  const newParent = parentIm.set('children', newChildren);
  storage.updateItem(newParent);
  storage.deleteItem(itemIm);
  return [newParent];
};

export const doDelete = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  const [ newParent ] = deleteBox(activeItem);
  activeItem$.set(newParent);
};
