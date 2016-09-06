var eventproxy = require('eventproxy');
var md5 = require('../common/encryptpass');
var UserModel = require('../models/user');

exports.showSignup = function(req, res) {
	res.render('sign/signup');
};

exports.signup = function(req, res) {
	//获取数据
	var userName = req.body.userName;
	var userPassword = req.body.userPassword;
	var rePassword = req.body.rePassword;
	var userEmail = req.body.userEmail;

	var ep = new eventproxy();
    ep.on('info_error', function(msg) {
        res.status(422);
        res.render('sign/signup',{error: msg});
    });
	
	//校验数据
	var hasEmptyInfo = [userName, userPassword, rePassword].some(function(item) {
		return item === '';
	});

	var isPassDiff = userPassword !== rePassword;

	if(hasEmptyInfo || isPassDiff) {
		ep.emit('info_error', '数据格式有误！');
	}

	UserModel.getUserByName(userName, function(error, users) {
		if(error) {
			ep.emit('info_error', '获取用户失败！');
			return;
		}

		if(users.length > 0) {
			ep.emit('info_error', '用户名或邮箱已被占用！');
			return;
		}

		UserModel.addUser({name: userName, password: md5.encrypt(userPassword, 'gzgqq'), email: userEmail}, function(error, user) {
			if(error) {
				ep.emit('info_error', '注册用户失败！');
				return;
			}

			if(user.length === 0) {
				ep.emit('info_error', '注册用户失败！');
			}

			res.render('sign/signup', {success: '恭喜你，注册成功！'});
		});
	});
};

exports.showSignin = function(req, res) {
	res.render('sign/signin');
};

exports.signin = function(req, res) {
	//获取数据
	var userName = req.body.userName;
	var userPassword = req.body.userPassword;
	var ep = new eventproxy();
	ep.on('info_error', function(msg) {
		res.status(422);
		res.render('sign/signin', {error: msg});
	});

	//校验数据
	var hasEmptyInfo = [userName, userPassword].some(function(item) {
		return item === '';
	});

	if(hasEmptyInfo) {
		ep.emit('info_error', '数据格式有误！');
		return;
	}

	UserModel.findOne({password: md5.encrypt(userPassword, 'gzgqq')}, function(err, user) {
		if(err || user === null) {
			ep.emit('info_error', '登录失败！');
			return;
		}
		
		res.session.user = user;
		res.render('sign/signin', {success: '登录成功！'});
	});

};