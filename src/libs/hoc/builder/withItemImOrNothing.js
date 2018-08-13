import { compose, branch, withProps, renderNothing } from 'recompose';
import storage from 'libs/storage';

export const withItemImOrNothing = compose(
  withProps(({ item }) => ({ itemIm: storage.getItem(item) })),
  branch(({ itemIm }) => !itemIm, renderNothing),
);
