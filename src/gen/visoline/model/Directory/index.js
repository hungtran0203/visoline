import Model from 'libs/model/model';
import Nested from 'libs/model/relations/Nested';
import HasMany from 'libs/model/relations/HasMany';

import register from 'libs/register';

const metaSymbol = Symbol('meta');
export class DirectoryModel extends Model {
  static COLNAME = 'directory';
  constructor(...args) {
    super(...args);

    const MetaModel = register('MODEL_CLASS').get('meta');

    // define parent-children relationship
    const parentChildrenRel = new Nested({ relOwner: this, relUpperName: 'parentId', relLowerName: 'children', relClass: this.constructor });
    this.parent = parentChildrenRel.getUpperRel();
    this.children = parentChildrenRel.getLowerRel();
    this.parentChildrenRel = parentChildrenRel;

    this.meta = new HasMany({ relOwner: this, relName: metaSymbol, relClass: MetaModel });
  }

  static mkdirp = (paths) => {
    return paths.reduce((currNode, path) => {
      let theNode = DirectoryModel.find((node) => {
        const parentId = currNode ? currNode.getId() : null;
        return (
          ((!node.get('parentId') && !parentId) || node.get('parentId') === parentId) &&
          node.get('name') === path
        );
      });
      // create node
      if(!theNode) {
        theNode = DirectoryModel.new({ name: path });
        const parentId = currNode ? currNode.getId() : null;
        theNode.parent.changeTo(parentId);
        theNode.parent.toIt().children.push(theNode);
        theNode.save();
      }
      return theNode;
    }, null);
  }

  static findRoot() {
    return this.find(node => !node.get('parentId'));
  }

  getPaths() {
    const paths = [];
    paths.push(this);
    let parentIt = this.parent.toIt();
    while(parentIt && parentIt.getId()) {
      paths.push(parentIt);
      parentIt = parentIt.parent.toIt();
    }
    return paths.reverse();
  }
};

// load schema
register.load(require.context('./schema', true, /.*(\.json)$/));
register('MODEL_CLASS').register(DirectoryModel.COLNAME, DirectoryModel);

export default DirectoryModel;
