import { withItemBuilder, getItemBuilder } from 'libs/hoc/builder';
import { compose, withHandlers, withProps, branch, renderNothing } from 'recompose';
import { withActivation } from 'libs/hoc/editor';
import { withModel } from '../../../../libs/model/hoc';
import { BoxModel } from '../../../../libs/editor/model/box';

const editorHOC = [
  withActivation(),
  withModel({ srcProp: 'item', model: BoxModel, dstProp: 'item', watching:true }),
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
