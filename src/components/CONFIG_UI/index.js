const requireAll = require.context('./', true, /.*(\.js)$/);
requireAll.keys().forEach((filename, index, files) => {
  requireAll(filename);
});
