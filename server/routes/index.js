'use strict'

const express = require('express')
const router = express.Router()
router.use('/api/v1/ide', require('./ide'))

module.exports = router;
