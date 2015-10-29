'use strict';

var express = require('express');
var controller = require('./facebook.controller');

var router = express.Router();

router.get('/callback', controller.build);
router.get('/auth', controller.auth);

module.exports = router;
