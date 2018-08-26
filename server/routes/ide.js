'use strict'

const express = require('express');
const router = express.Router({mergeParams: true});
const { exec } = require('child_process');
const path = require('path');
const appDir = path.dirname(path.dirname(require.main.filename));
const fs = require('fs');
const mkdirp = require('mkdirp');
const _ = require('lodash');

router.post('/openTextSource', openTextSource)

function openTextSource(req, res, next) {
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
}

router.post('/updateMeta', updateMeta)
function updateMeta(req, res, next) {
  const route = req.baseUrl;
  const payload = req.body;
  const metaObj = _.get(payload, 'meta', {});
  const ns = _.get(payload, 'ns', '');
  const filePaths = ns.split('.');
  const metaPath = path.join(appDir, 'src', 'gen', ...filePaths, 'meta.json');
  mkdirp(path.dirname(metaPath), () => {
    fs.writeFile(metaPath, JSON.stringify(metaObj), (err) => {
      if (err) {
        return next();
      }  
      res.json({status: 1});
    })  
  })
}

module.exports = router;
