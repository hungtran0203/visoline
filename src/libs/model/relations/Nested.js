import HasMany from './HasMany';
import BelongsTo from './BelongsTo';

/*
  wrapper of immutable object
*/
export class Nested {
  relOwner = null;
  relUpperName = '';
  relLowerName = '';
  relClass = null;

  constructor({ relOwner, relUpperName, relLowerName, relClass }) {
    Object.assign(this, { relOwner, relUpperName, relLowerName, relClass });
    this[relUpperName] = new BelongsTo({ relOwner, relName: relUpperName, relClass });
    this[relLowerName] = new HasMany({ relOwner, relName: relLowerName, relClass });
  }

  getUpperRel() {
    return this[this.relUpperName];
  }

  getLowerRel() {
    return this[this.relLowerName];
  }

  indexOf(...args) {
    return this.getLowerRel().indexOf(...args);
  }
}

export default Nested;
