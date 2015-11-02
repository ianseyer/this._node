var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/vis', function(req, res) {
  res.render('vis');
})

module.exports = router;
