var express = require('express');
var router = express.Router();
var signController = require('../controllers/signController');

//用户注册页面
router.get('/signup', signController.showSignup);

//处理用户注册信息
router.post('/signup', signController.signup);

router.get('/signin', signController.showSignin);

router.post('/signin', signController.signin);

module.exports = router;