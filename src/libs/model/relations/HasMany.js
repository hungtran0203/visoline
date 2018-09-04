import { List } from 'immutable';
import register from 'libs/model/register';

/*
  wrapper of immutable object
*/
export class HasMany {
  relOwner = null;
  relName = '';
  relClass = null;

  static EMPTY_COLLECTION = new List();
  constructor({ relOwner, relName, relClass }) {
    Object.assign(this, { relOwner, relName, relClass });
  }

  getRelIt(rel) {
    const Class = this.relClass;
    const relIt = new Class(rel);
    return relIt;
  }

  getRelListIm() {
    return this.relOwner.get(this.relName, this.constructor.EMPTY_COLLECTION);
  }

  toIm() {
    return this.getRelListIm();
  }

  toIt() {
    return this.getRelListIm().map(refId => register.resolveById(refId, this.relClass));
  }

  toJS() {
    return this.getRelListIm().toJS();
  }

  toId() {
    return this.toJS();
  }

  set(path, value) {
    this.data = this.data.set(path, value);
    return this;
  }

  get(path, unsetVal) {
    return this.data.get(path, unsetVal);
  }

  indexOf(rel) {
    const relIt = this.getRelIt(rel);
    const relListIm = this.getRelListIm();
    return relListIm.indexOf(relIt.getRefId());
  }

  changeTo(newVal) {
    let val = List([]);
    if (newVal instanceof this.relClass) {
      val = val.push(newVal.getRefId());
    }
    if (Array.isArray(newVal)) {
      newVal.map(item => {
        if (item instanceof this.relClass) {
          val = val.push(item.getRefId());
        } else {
          const itemIt = this.relClass.getInstance(val);
          if(itemIt) {
            val = val.push(itemIt.getRefId());
          }
        }
            
      })
    }
    this.relOwner.set(this.relName, val);
    this.relOwner.save();
  }

  /*
    MODIFIER METHODS
  */

  insert(rel, index) {
    const relIt = this.getRelIt(rel);
    const relListIm = this.getRelListIm().insert(relIt.getRefId(), index);
    this.relOwner.set(this.relName, relListIm).save();
    return this;
  }

  push(rel) {
    const relIt = this.getRelIt(rel);
    const relListIm = this.getRelListIm().push(relIt.getRefId());
    this.relOwner.set(this.relName, relListIm).save();
    return this;
  }

  addUnique(rel) {
    const relIt = this.getRelIt(rel);
    const relIndex = this.indexOf(rel);
    if (relIndex === -1 ) {
      const relListIm = this.getRelListIm().push(relIt.getRefId());
      this.relOwner.set(this.relName, relListIm).save();  
    }
    return this;
  }

  remove(rel) {
    const relIt = this.getRelIt(rel);
    if (relIt.isExists()) {
      const relIndex = this.indexOf(rel);
      if (relIndex >= 0) {
        const relListIm = this.getRelListIm().remove(relIndex);
        this.relOwner.set(this.relName, relListIm).save();
      }
    }
    return this;
  }

  move(rel, distance=0) {
    const relIt = this.getRelIt(rel);
    const relListIm = this.getRelListIm();
    const index = this.indexOf(rel);
    let newIndex = index + distance;
    newIndex = newIndex < 0 ? 0 : newIndex;
    if (relListIm) {
      const newReListIm = relListIm.delete(index).insert(newIndex, relIt.getRefId());
      this.relOwner.set(this.relName, newReListIm).save();
    }
    return this;
  }

  clear() {
    this.relOwner.set(this.relName, this.constructor.EMPTY_COLLECTION).save();
  }
}

export default HasMany;
