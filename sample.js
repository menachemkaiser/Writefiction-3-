var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');
var async = require('async');
var User = require('./api/models/user.js');
var changeCase = require("change-case");
var dbConfig = require('./db');

// Generates hash using bCrypt
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

mongoose.connect(dbConfig.url, function (err, db) {

	// admin
	var newUser = new User({email: "jacques.van122@yahoo.com", password: createHash("apple"), 
							firstname: "jacques", lastname: "van zyl",
							role: 1, status: true});

	newUser.save(function(err) {
		if (err) return done(err);
		console.log("admin1 created!");
	});

	newUser = new User({email: "dennis.van122@yahoo.com", password: createHash("apple"), 
							firstname: "dennis", lastname: "van luik",
							role: 1, status: true});

	newUser.save(function(err) {
		if (err) return done(err);
		console.log("admin2 created!");
	});
});
