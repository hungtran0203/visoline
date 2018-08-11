const selectors = {}
var requireTest = require.context('../../gen', true, /.*\.js$/);
requireTest.keys().forEach((...args) => {
  console.log('args', args);
  const req = requireTest(...args);
  console.log('req', req);
  console.log(Object.keys(req));
  Object.keys(req).map(key => selectors[key] = req[key]);
});

console.log('selectors', selectors);
// const selectors = require('require-all')({
//   dirname:  __dirname + '../../gen',
//   filter:  /.*\.js$/,
//   excludeDirs:  /^\.(git|svn)$/,
//   recursive: true,
//   map: function(name, path) {
//     console.log('name', name);
//     return name;
//   },
// });

// console.log('selectors', selectors);

export default selectors;