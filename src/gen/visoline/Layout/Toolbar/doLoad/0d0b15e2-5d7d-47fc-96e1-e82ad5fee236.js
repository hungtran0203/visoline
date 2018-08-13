import storage from 'libs/storage';

export const doLoad = ({ rootItem$ }) => () => {
  // load storage
  const data = localStorage.getItem('visoline.storage');
  if(data) {
    storage.load(JSON.parse(data));
  }
  // load rootItem
  const rootItemId = localStorage.getItem('visoline.rootItemId');
  if (rootItemId) {
    const rootItemIm = storage.getItem(rootItemId);
    rootItem$.set(rootItemIm);  
  }
};
