import { withItemBuilder, getItemBuilder } from 'libs/hoc/builder';
import { compose, withHandlers, withProps, branch, renderNothing } from 'recompose';
import { withActivation } from 'libs/hoc/editor';
import withModel from 'gen/visoline/hoc/withModel';

const editorHOC = [
  withActivation(),
  withModel({ srcProp: 'item', dstProp: 'item', watching:true }),
  withProps(() => ({ className: 'defaultBox' })),
];

export const PageRender = compose(
  withItemBuilder(editorHOC),
  getItemBuilder(),
  branch(
    ({ item }) => !item,
    renderNothing,
  )
)(({ itemBuilder, item }) => itemBuilder()(item));

export default PageRender;
