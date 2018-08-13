import storage from 'libs/storage';

export const doSave = ({ rootItem$ }) => () => {
  const data = storage.toJS();
  localStorage.setItem('visoline.storage', JSON.stringify(data));
  // save rootItem
  if (rootItem$) {
    localStorage.setItem('visoline.rootItemId', storage.getItem(rootItem$.get()).get('id'));
  }
};
