import { List } from 'immutable';
import { FORMAT_JSON, FORMAT_IM, FORMAT_IT, FORMAT_ID} from './constants';

export const formatter = (Item) => ({
  formatIt = (itemIt, format) => {
    switch(format) {
      case FORMAT_JSON:
        return itemIt.toJS();
      case FORMAT_IM:
        return itemIt.toIm();
      case FORMAT_ID:
        return itemIt.getId();
      default:
        return itemIt;
    }  
  },
  formatItCollection = (collectionIt, format) => {
    switch(format) {
      case FORMAT_JSON:
        return collectionIt.map(itemIt => itemIt.toJS());
      case FORMAT_IM:
        if (List.isList(collectionIt)) {
          return collectionIt.toArray().map(itemIt => itemIt.toIm());
        }
        return collectionIt.map(itemIt => itemIt.toIm()).toJS();
      case FORMAT_ID:
        if (List.isList(collectionIt)) {
          return collectionIt.toArray().map(itemIt => itemIt.getId());
        }
        return collectionIt.map(itemIt => itemIt.getId()).toJS();
      default:
        return collectionIt;
    }  
  },
  formatIm = (itemIm, format) => {
    switch(format) {
      case FORMAT_JSON:
        return itemIm.toJS();
      case FORMAT_IM:
        return itemIm;
      case FORMAT_ID:
        return (new Item(itemIm)).getId();
      case FORMAT_IT:
        return new Item(itemIm);
      default:
        return itemIm;
    }  
  },
  formatImCollection = (collectionIm, format) => {
    switch(format) {
      case FORMAT_JSON:
        return collectionIm.toJS();
      case FORMAT_IM:
        return collectionIm;
      case FORMAT_ID:
        if (List.isList(collectionIm)) {
          return collectionIm.toArray().map(itemIm => (new Item(itemIm)).getId());
        }
        return collectionIm.map(itemIm => (new Item(itemIm)).getId()).toJS();
      case FORMAT_IT:
        if (List.isList(collectionIm)) {
          return collectionIm.toArray().map(itemIm => new Item(itemIm));
        }
        return collectionIm.map(itemIm => new Item(itemIm)).toJS();
      default:
        return collectionIm;
    }  
  },
  formatJs = (itemJs, format) => {
    switch(format) {
      case FORMAT_JSON:
        return itemJs;
      case FORMAT_IM:
        return (new Item(itemJs)).toIm();
      case FORMAT_IT:
        return new Item(itemJs);
      case FORMAT_ID:
        return (new Item(itemJs)).getId();
      default:
        return itemJs;
    }  
  },
  formatJsCollection = (collectionJs, format) => {
    switch(format) {
      case FORMAT_JSON:
        return collectionJs;
      case FORMAT_IM:
        return collectionJs.map(itemJs => (new Item(itemJs)).toIm());
      case FORMAT_ID:
        return collectionJs.map(itemJs => (new Item(itemJs)).getId());
      case FORMAT_IT:
        return collectionJs.map(itemJs => new Item(itemJs));
      default:
        return collectionJs;
    }  
  },
});

export default formatter;

