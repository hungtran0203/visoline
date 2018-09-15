import { withItemBuilder, getItemBuilder, withItemEnhancer } from 'libs/hoc/builder';
import { compose, withHandlers, withProps, branch, renderNothing } from 'recompose';
import { withActivation } from 'libs/hoc/editor';
import withModel from 'gen/visoline/hoc/withModel';

const hocs = [
  withModel({ srcProp: 'item', dstProp: 'item', watching:true }),
  withItemEnhancer(),
];

export const PageViewModeRender = compose(
  withItemBuilder(hocs),
  getItemBuilder(),
  branch(
    ({ item }) => !item,
    renderNothing,
  )
)(({ itemBuilder, item }) => itemBuilder()(item));

export default PageViewModeRender;
