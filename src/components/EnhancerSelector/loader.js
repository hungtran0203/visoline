import _ from 'lodash';

const selectors = {}
var requireAll = require.context('../../gen', true, /.*\.js$/);
requireAll.keys().forEach((...args) => {
  const path = args[0];
  const paths = _.compact(_.split(_.trim(path, '.'), '/'));
  const req = requireAll(...args);
  Object.keys(req).map(key => {
    selectors[key] = req[key];
    _.set(selectors, paths, req[key]);
  });
});
export default selectors;