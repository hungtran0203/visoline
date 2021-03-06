import { List } from 'immutable';

const EMPTY_LIST = new List();
/*
  wrapper of immutable object
*/
export class HasMany {
  relOwner = null;
  relName = '';
  relClass = null;

  constructor({ relOwner, relName, relClass }) {
    Object.assign(this, { relOwner, relName, relClass });
  }

  getRelIt(rel) {
    const Class = this.relClass;
    const relIt = new Class(rel);
    return relIt;
  }

  getRelListIm() {
    return this.relOwner.get(this.relName, EMPTY_LIST);
  }

  toIm() {
    return this.getRelListIm();
  }

  toIt() {
    return this.getRelListIm().map(im => this.relClass.getInstance(im));
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
    return relListIm.indexOf(relIt.getId());
  }

  changeTo(newVal) {
    this.relOwner.set(this.relName, List(newVal));
    this.relOwner.save();
  }

  /*
    MODIFIER METHODS
  */

  insert(rel, index) {
    const relIt = this.getRelIt(rel);
    const relListIm = this.getRelListIm().insert(relIt.getId(), index);
    this.relOwner.set(this.relName, relListIm).save();
    return this;
  }

  push(rel) {
    const relIt = this.getRelIt(rel);
    const relListIm = this.getRelListIm().push(relIt.getId());
    this.relOwner.set(this.relName, relListIm).save();
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
      const newReListIm = relListIm.delete(index).insert(newIndex, relIt.getId());
      this.relOwner.set(this.relName, newReListIm).save();
    }
    return this;
  }

  clear() {
    this.relOwner.set(this.relName, EMPTY_LIST).save();
  }
}

export default HasMany;
