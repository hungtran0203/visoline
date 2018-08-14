/*
  wrapper of immutable object
*/
export class BelongsTo {
  relOwner = null;
  relName = '';
  relClass = null;

  constructor({ relOrig, relName, relClass }) {
    Object.assign(this, { relOrig, relName, relClass });
  }

  getRelIt() {
    const relIt = this.relClass.getInstance(this.getRel());
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

  changeTo(newVal) {
    const newOrig = this.relClass.getInstance(newVal);
    if(newOrig.isExists()) {
      this.relOwner.set(this.relName, newOrig.getId());
      this.relOwner.save();
    }
  }
}

export default BelongsTo;
