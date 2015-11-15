var express = require('express');
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

// Generates hash using bCrypt
var createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports.controller = function(app) {
	
	/*
	* regular user level
	*/
	// getting the user information from web token
	app.get('/api/users/getUserInformation', function(req, res) {
		User.findOne({_id: req.decoded._id}, function(err, user) {
			if (err) throw err;

			if (!user) {
				return res.status(401).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else if (user) {
				return res.status(200).json({success: true, user: user});
			}
		});
	});

	// update profile from web token
	app.post('/api/users/updateProfile', function(req, res) {
		var newProfile = req.body;
		delete newProfile.password;
		var userId = req.decoded._id;

		User.findOne({_id: userId}, function(err, usr) {
			if (err) throw err;

			User.update(
				{_id: userId},
				{$set: newProfile},
				{upsert: false, runValidators: true},
				function(err){
					if (err){
						return res.status(201).json({ 
					        success: false, 
					        message: 'Bad Request.' 
					    });
					}

					return res.status(200).json({success: true});
				}
			);
		});
	});

	// update password
	app.post('/api/users/updatePassword', function(req, res) {
		var userId = req.decoded._id;

		User.findOne({_id: userId}, function(err, usr) {
			if (err) throw err;

			usr.password = createHash(req.body.password);
			usr.save(function(err){});
			return res.status(200).json({success: true});
		});
	});

	/*
	* admin access level
	*/
	// for getting the list of users
	app.get('/api/users/getList', function(req, res) {
		if (req.decoded.role != 1)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad request.' 
		    });
		}

		User.find({}, function(err, usrlst) {
			if (err) throw err;

			if (usrlst.length == 0) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else {
				return res.status(200).json({success: true, users: usrlst});
			}
		});
	});

	// getting the user information with specific id
	app.get('/api/users/getUserInfoById/:id', function(req, res) {
		if (req.decoded.role != 1)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad request.' 
		    });
		}

		if (!req.params.id)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		User.findOne({_id: req.params.id}, function(err, user) {
			if (err) throw err;

			if (!user) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else if (user) {				
				return res.status(200).json({success: true, user: user});
			}
		});
	});

	// update the user information with specific id
	app.post('/api/users/updateProfileById/:id', function(req, res) {
		if (req.decoded.role != 1)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad request.' 
		    });
		}

		if (!req.params.id)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		var newProfile = req.body;
		delete newProfile.password;
		var userId = req.params.id;

		User.findOne({_id: userId}, function(err, usr) {
			if (err) throw err;

			User.update(
				{_id: userId},
				{$set: newProfile},
				{upsert: false, runValidators: true},
				function(err){
					if (err){
						return res.status(201).json({ 
					        success: false, 
					        message: 'Bad Request.' 
					    });
					}

					return res.status(200).json({success: true});
				}
			);
		});
	});

	// delete user
	app.get('/api/users/delete/:id', function(req, res) {
		if (req.decoded.role != 1)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad request.' 
		    });
		}
		
		if (!req.params.id)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		User.findOne({_id: req.params.id}, function(err, usr) {
			if (err) throw err;
			
			usr.remove();
			return res.status(200).json({success: true});
		});
	});
}
