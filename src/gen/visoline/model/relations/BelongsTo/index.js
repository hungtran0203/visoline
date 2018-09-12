import Registry from 'libs/Registry';

/*
  wrapper of immutable object
*/
export class BelongsTo {
  relOwner = null;
  relName = '';
  relClass = null;

  constructor({ relOwner, relName, relClass }) {
    Object.assign(this, { relOwner, relName, relClass });
  }

  getRelIt() {
    const relIt = Registry('MODEL_CLASS').resolveById(this.getRel(), this.relClass);
    return relIt;
  }

  getRel() {
    return this.relOwner.get(this.relName, null);
  }

  toIt() {
    return this.getRelIt();
  }

  toJS() {
    return this.getRelIt().toJS();
  }

  toId() {
    return this.getRel();
  }

  set(...args) {
    return this.getRelIt().set(...args);
  }

  get(...args) {
    return this.getRelIt().get(...args);
  }

  is(val) {
    const relIt = this.toIt();
    if (!relIt) {
      return !val;
    }
    return relIt.is(val);
  }

  changeTo(newVal) {
    const newOrig = Registry('MODEL_CLASS').resolveById(newVal, this.relClass);
    if(newOrig && newOrig.isExists()) {
      this.relOwner.set(this.relName, newOrig.getRefId());
      this.relOwner.save();
    }
  }
}

export default BelongsTo;
