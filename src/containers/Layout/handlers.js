import { fromJS } from 'immutable';
import _ from 'lodash';
import uuid from 'uuid';
import invariant from 'invariant';
import storage from 'libs/storage';
import styles from './styles.scss';
import classnames from 'classnames';
import * as listHelper from 'libs/immutable/list';
import * as Enhancers from 'libs/enhancer';
import EnhancerItem from 'libs/storage/enhancer';

import BoxModel from 'gen/visoline/model/Box';
import BoxEnhancerModel from 'gen/visoline/model/BoxEnhancer';

const EDITOR_URL = 'http://localhost:3001';

export const initBox = ({ parentId }) => {
  return fromJS({
    id: uuid(),
    parentId,
    type: 'Box',
    className: classnames(styles.box),
    children: [],
  });
};

export const newRootBox = (opts) => {
  const newBox = initBox({ ...opts, parentId: null });
  storage.updateItem(newBox);
  return newBox;
};

export const insertBox = (parentItem, opts) => {
  const parent = storage.isItemId(parentItem) ? storage.getItemFromId(parentItem) : parentItem;
  invariant(parent, `Parent Box (${parentItem}) does not exists`);
  const parentId = storage.isItemId(parentItem) ? parentItem : parent.get('id');
  const newBox = initBox({ ...opts, parentId });
  const children = parent.get('children', fromJS([])).push(storage.getItemId(newBox));
  storage.updateItem(newBox);
  const newParent = parent.set('children', children);
  storage.updateItem(newParent);
  return [newBox, newParent];
};

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

const saveModelToServer = (Model) => {
  const modelIts = Model.findAll(() => true);
  const data = {};
  modelIts.map(modelIt => data[modelIt.getId()] = modelIt.toJS());
  const endpointUrl = `${EDITOR_URL}/api/v1/ide/saveData`;
  fetch(endpointUrl, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      data,
      name: Model.COLNAME,
    }),
  });  

};

const loadModelFromServer = (Model) => {
  const endpointUrl = `${EDITOR_URL}/api/v1/ide/loadData`;
  fetch(endpointUrl, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      name: Model.COLNAME,
    }),
  })
  .then(res => res.json())
  .then(res => {
    const data = _.get(res, 'data');
    if(data) {
      _.mapValues(data, (modelObj) => {
        const modelIt = Model.getInstance(modelObj);
        if (modelIt && modelIt.getId()) {
          modelIt.save();
          console.log('modelIt', modelIt.getId());  
        } else {
          console.log(modelObj);
        }
      })
    }
  });

};

export const doSave = ({ rootItem$ }) => () => {
  saveModelToServer(BoxModel);
  saveModelToServer(BoxEnhancerModel);
};

export const doLoad = ({ rootItem$ }) => () => {
  loadModelFromServer(BoxModel);
  // load storage
  // const data = localStorage.getItem('visoline.storage');
  // if(data) {
  //   storage.load(JSON.parse(data));
  // }

  // EnhancerItem.doLoad();
  // // load rootItem
  // const rootItemId = localStorage.getItem('visoline.rootItemId');
  // if (rootItemId) {
  //   const rootItemIm = storage.getItem(rootItemId);
  //   rootItem$.set(rootItemIm);  
  // }
}

export const newRoot =  ({ setRootItem, setActiveItem }) => () => {
  // const root = newRootBox();
  const root = BoxModel.new({ type: 'Box' });
  root.save();
  setRootItem(root);
  setActiveItem(root);
  return root;
};

export const doPush = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  const parentIm = storage.getParent(activeItem);
  if(parentIm) {
    insertBox(parentIm, {});
  }
};

export const doInsert = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  const [newItem, newParent ] = insertBox(activeItem, {});
  activeItem$.set(newItem);
};

export const doDelete = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  const [ newParent ] = deleteBox(activeItem);
  activeItem$.set(newParent);
};

export const toColum = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  const itemIm = storage.getItem(activeItem);
  const newItem = itemIm.set('type', 'Flex');
  storage.updateItem(newItem);
};

export const toRow = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  const itemIm = storage.getItem(activeItem);
  const newItem = itemIm.set('type', 'Box');
  storage.updateItem(newItem);
};

export const doGroup = ({ activeItem$, selectedItems$ }) => () => {
  const activeItem = activeItem$.get();
  const selectedItems = selectedItems$.get() || [];
  const itemIm = storage.getItem(activeItem);
  // items must with same parent to be able grouping
  let canGroup = true;
  if (itemIm && selectedItems.length) {
    const parentIm = storage.getParent(itemIm);
    const groupItemIds = [itemIm.get('id')];
    if (parentIm) {
      selectedItems.map(selectedItem => {
        const selectedItemIm = storage.getItem(selectedItem);
        const pIm = storage.getParent(selectedItem);
        if(!pIm || pIm.get('id') !== parentIm.get('id')) {
          canGroup = false;
        } else {
          groupItemIds.push(selectedItemIm.get('id'));
        }
      });
      if (canGroup) {
        const groupItemIm = initBox({ parentId: parentIm.get('id') }).set('children', fromJS(groupItemIds));
        // remove groupItems from parent children list
        let children = parentIm.get('children');
        children = listHelper.replace(children, groupItemIds[0], groupItemIm.get('id'));
        children = listHelper.remove(children, groupItemIds);
        const newParentIm = parentIm.set('children', children);
        // init new parent item
        storage.updateItem(groupItemIm);
        // update original parent item
        storage.updateItem(newParentIm);
        // update groupItems
        groupItemIds.map(gItemId => {
          const gItemIm = storage.getItem(gItemId);
          storage.updateItem(gItemIm.set('parentId', groupItemIm.get('id')));
        })
      }  
    }
  }
};

export const doUnGroup = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  const itemIm = storage.getItem(activeItem);
  if (itemIm) {
    const parentIm = storage.getParent(itemIm);
    if (parentIm && itemIm.get('children').toJS().length) {
      const children = listHelper.replace(parentIm.get('children'), itemIm.get('id'), ...itemIm.get('children').toJS());
      const newParent = parentIm.set('children', children);
      storage.updateItem(newParent);
      itemIm.get('children').map(childId => {
        const childIm = storage.getItem(childId);
        const newChildIm = childIm.set('parentId', newParent.get('id'));
        storage.updateItem(newChildIm);
      });
      storage.deleteItem(itemIm);
    }
  }
};

export const changeBackground = ({ activeItem$ }) => (color) => {
  const activeItem = activeItem$.get();
  if (activeItem) {
    const itemIm = storage.getItem(activeItem);
    const newItemIm = itemIm.setIn(['style', 'backgroundColor'], color.hex);
    storage.updateItem(newItemIm);
  }
};

export const doAddEnh = ({ activeItem$ }) => () => {
  const activeItem = activeItem$.get();
  if (activeItem) {
    const itemIm = storage.getItem(activeItem);
    const enhancers = itemIm.get('enhancers', fromJS([]));
    const Enhancer = Enhancers.withHandlers;
    const newEnhancer = new Enhancer({
      options: {
        props: {
          onClick: 'doAnything',
        },
      },
    });
    const newItemIm = itemIm.set('enhancers', enhancers.push(newEnhancer.toIm()));
    storage.updateItem(newItemIm);
  }  
}