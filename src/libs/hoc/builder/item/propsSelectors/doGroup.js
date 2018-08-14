import Item from 'libs/storage/item';
import { fromJS } from 'immutable';
import * as listHelper from 'libs/immutable/list';

export const doGroup = ({ activeItem$, selectedItems$ }) => () => {
  const activeItem = activeItem$.get();
  const selectedItems = selectedItems$.get() || [];
  const itemIt = Item.getInstance(activeItem)
  // items must with same parent to be able grouping
  let canGroup = true;
  if (itemIt.isExists() && selectedItems.length) {
    const parentIt = itemIt.parent.toIt();
    const groupItemIds = [itemIt.getId()];
    if (parentIt.isExists()) {
      selectedItems.map(selectedItem => {
        const selectedItemIt = Item.getInstance(selectedItem);
        const pIt = selectedItemIt.parent.toIt();
        if(!parentIt.isExists() || pIt.getId() !== parentIt.getId()) {
          canGroup = false;
        } else {
          groupItemIds.push(selectedItemIt.getId());
        }
      });
      if (canGroup) {
        const groupItemIt = Item.newInstance().parent.changeTo(parentIt.getId());
        groupItemIt.children.changeTo(fromJS(groupItemIds));
        // remove groupItems from parent children list
        let childrenIm = parentIt.children.toIm();
        childrenIm = listHelper.replace(childrenIm, groupItemIds[0], groupItemIt.getId());
        childrenIm = listHelper.remove(childrenIm, groupItemIds);
        parentIt.children.changeTo(childrenIm);
        // update groupItems
        groupItemIds.map(gItemId => {
          const gItemIt = Item.getInstance(gItemId);
          gItemIt.parent.changeTo(groupItemIt.getId());
        });
      }
    }
  }
};
