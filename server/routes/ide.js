'use strict'

const express = require('express');
const router = express.Router({mergeParams: true});
const { exec } = require('child_process');
const path = require('path');
const appDir = path.dirname(path.dirname(require.main.filename));
const fs = require('fs');
const mkdirp = require('mkdirp');
const _ = require('lodash');
const beautify = require("json-beautify");

router.post('/openTextSource', (req, res, next) => {
  const route = req.baseUrl;
  const payload = req.body;
  const { name, path: filePath } = payload;
  const filePaths = filePath.split('.');
  const sourcePath = path.join(appDir, 'src', 'gen', ...filePaths, `${name}.js`);

  exec(`code -r ${sourcePath}`, (err, stdout, stderr) => {
    if (err) {
      return next();
    }  
    res.json({status: 1})
  });
});

router.post('/updateMeta', (req, res, next) => {
  const route = req.baseUrl;
  const payload = req.body;
  const metaObj = _.get(payload, 'meta', {});
  const ns = _.get(payload, 'ns', '');
  const filePaths = ns.split('.');
  const metaPath = path.join(appDir, 'src', 'gen', ...filePaths, 'meta.json');
  mkdirp(path.dirname(metaPath), () => {
    fs.writeFile(metaPath, beautify(metaObj, null, 2, 80), (err) => {
      if (err) {
        return next();
      }  
      res.json({status: 1});
    })  
  })
});

router.post('/renameDir', (req, res, next) => {
  const route = req.baseUrl;
  const payload = req.body;
  const oldDir = _.get(payload, 'oldDir', []);
  const newDir = _.get(payload, 'newDir', []);
  const oldPath = path.join(appDir, 'src', 'gen', ...oldDir);
  const newPath = path.join(appDir, 'src', 'gen', ...newDir);
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      return next();
    }  
    res.json({status: 1});
  });
})


module.exports = router;
