import register from 'libs/model/register';

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
    console.log('this.getRel()this.getRel()', this.getRel(), this.relOwner.toJS());
    const relIt = register.resolveById(this.getRel(), this.relClass);
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
    const newOrig = register.resolveById(newVal, this.relClass);
    if(newOrig && newOrig.isExists()) {
      this.relOwner.set(this.relName, newOrig.getRefId());
      this.relOwner.save();
    }
  }
}

export default BelongsTo;
