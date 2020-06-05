var mongoose = require("mongoose"),
	passportLocalSchema = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
	username : String,
	password : String
});

UserSchema.plugin(passportLocalSchema);

module.exports = mongoose.model("User",UserSchema);