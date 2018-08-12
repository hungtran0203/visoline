const selectors = {}
var requireTest = require.context('../../gen', true, /.*\.js$/);
requireTest.keys().forEach((...args) => {
  console.log('args', args);
  const req = requireTest(...args);
  console.log('req', req);
  console.log(Object.keys(req));
  Object.keys(req).map(key => selectors[key] = req[key]);
});
export default selectors;