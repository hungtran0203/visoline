import selectors from 'components/PropsSelectors/loader';

export const lookup = (id) => {
  return selectors[id];
};

