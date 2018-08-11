'use strict'

const express = require('express')
const router = express.Router({mergeParams: true})
const { exec } = require('child_process');
const path = require('path');
const appDir = path.dirname(path.dirname(require.main.filename));


router.get('/openTextSource', handler)

function handler(req, res, next) {
  const route = req.baseUrl;
  const { name, path: filePath } = req.query;
  const filePaths = filePath.split('.');
  const sourcePath = path.join(appDir, 'src', 'gen', ...filePaths, `${name}.js`);

  exec(`code -r ${sourcePath}`, (err, stdout, stderr) => {
    if (err) {
      return next();
    }  
    res.json({status: 1})
  });
}
module.exports = router;
