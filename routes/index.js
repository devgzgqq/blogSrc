var express = require('express');
var router = express.Router();
var indexContrllor = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexContrllor.showIndex);

module.exports = router;
