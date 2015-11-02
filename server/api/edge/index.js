'use strict';

var express = require('express');
var controller = require('./edge.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/to/:id', controller.findTo);
router.get('/to/:id/:type', controller.findToType);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
