import { Item } from './item';
import { List } from 'immutable';

export const formatIt = (itemIt, format) => {
  switch(format) {
    case Item.FORMAT_JSON:
      return itemIt.toJS();
    case Item.FORMAT_IM:
      return itemIt.toIm();
    case Item.FORMAT_ID:
      return itemIt.getId();
    default:
      return itemIt;
  }  
};

export const formatItCollection = (collectionIt, format) => {
  switch(format) {
    case Item.FORMAT_JSON:
      return collectionIt.map(itemIt => itemIt.toJS());
    case Item.FORMAT_IM:
      if (List.isList(collectionIt)) {
        return collectionIt.toArray().map(itemIt => itemIt.toIm());
      }
      return collectionIt.map(itemIt => itemIt.toIm()).toJS();
    case Item.FORMAT_ID:
      if (List.isList(collectionIt)) {
        return collectionIt.toArray().map(itemIt => itemIt.getId());
      }
      return collectionIt.map(itemIt => itemIt.getId()).toJS();
    default:
      return collectionIt;
  }  
};

export const formatIm = (itemIm, format) => {
  switch(format) {
    case Item.FORMAT_JSON:
      return itemIm.toJS();
    case Item.FORMAT_IM:
      return itemIm;
    case Item.FORMAT_ID:
      return (new Item(itemIm)).getId();
    case Item.FORMAT_IT:
      return new Item(itemIm);
    default:
      return itemIm;
  }  
};

export const formatImCollection = (collectionIm, format) => {
  switch(format) {
    case Item.FORMAT_JSON:
      return collectionIm.toJS();
    case Item.FORMAT_IM:
      return collectionIm;
    case Item.FORMAT_ID:
      if (List.isList(collectionIm)) {
        return collectionIm.toArray().map(itemIm => (new Item(itemIm)).getId());
      }
      return collectionIm.map(itemIm => (new Item(itemIm)).getId()).toJS();
    case Item.FORMAT_IT:
      if (List.isList(collectionIm)) {
        return collectionIm.toArray().map(itemIm => new Item(itemIm));
      }
      return collectionIm.map(itemIm => new Item(itemIm)).toJS();
    default:
      return collectionIm;
  }  
};

export const formatJs = (itemJs, format) => {
  switch(format) {
    case Item.FORMAT_JSON:
      return itemJs;
    case Item.FORMAT_IM:
      return (new Item(itemJs)).toIm();
    case Item.FORMAT_IT:
      return new Item(itemJs);
    case Item.FORMAT_ID:
      return (new Item(itemJs)).getId();
    default:
      return itemJs;
  }  
};

export const formatJsCollection = (collectionJs, format) => {
  switch(format) {
    case Item.FORMAT_JSON:
      return collectionJs;
    case Item.FORMAT_IM:
      return collectionJs.map(itemJs => (new Item(itemJs)).toIm());
    case Item.FORMAT_ID:
      return collectionJs.map(itemJs => (new Item(itemJs)).getId());
    case Item.FORMAT_IT:
      return collectionJs.map(itemJs => new Item(itemJs));
    default:
      return collectionJs;
  }  
};
