var mongoose = require('../mongoose_helper');

var UserSchema = new mongoose.Schema({
	name: String,
	password: String,
	email: {type: String, default: ''},
	createTime: {type: Date, default: Date.now}
});

UserSchema.static('getUserByName', function(userName, callback) {
	this.find({name: userName}, callback);
});

UserSchema.static('addUser', function(user, callback) {
	this.create(user, callback);
});

module.exports = mongoose.model('user', UserSchema);