var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/logout', function (req, res, next) {
  console.log('hello');
  res.cookie('jwt', '', { expires: new Date(0) });
  res.json('logout successful');
});

module.exports = router;
