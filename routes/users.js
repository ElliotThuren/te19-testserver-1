var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Detta blir vad servern visar.');
});

module.exports = router;
