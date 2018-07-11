import _ from 'lodash';
export const valueMatching = (value, matches) => (
  _.isEqual(value, matches)
  || Array.isArray(matches) && matches.indexOf(value) !== -1
  || !!_.get(matches, value)
);
