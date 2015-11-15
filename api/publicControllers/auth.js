var express = require('express');
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var Template = require('../models/template.js');

module.exports.controller = function(app) {

	var escapeRegExp = function(str) {
		return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}

	var replaceAll = function(str, find, replace) {
		return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	}

	// Filtering templates
	var filterTemplate = function(req, res, entrylist)
	{
		// Genre Filter
		for (var i = 0; i < entrylist.length; i ++)
		{
			var gen_tmp = entrylist[i].genres.split("|");
			var cnt = 0;

			for (var j = 0; j < req.body.genres.length; j ++)
				for (var k = 0; k < gen_tmp.length; k ++)
					if (req.body.genres[j] == gen_tmp[k])
					{
						cnt = cnt + 1;
						break;
					}

			if (cnt == 0){
				entrylist.splice(i, 1);
				i = i - 1;
			}else{
				entrylist[i].similarity = cnt * 2;
			}
		}

		// Conflict Filter
		for (var i = 0; i < entrylist.length; i ++)
		{
			var cn_tmp = entrylist[i].conflicts.split("|");
			var cnt = 0;

			for (var j = 0; j < req.body.conflicts.length; j ++)
				for (var k = 0; k < cn_tmp.length; k ++)
					if (req.body.conflicts[j] == cn_tmp[k])
					{
						cnt = cnt + 1;
						break;
					}

			if (cnt == 0){
				entrylist.splice(i, 1);
				i = i - 1;
			}else{
				entrylist[i].similarity += cnt * 1.5;
			}
		}

		// Adjust Filter
		for (var i = 0; i < entrylist.length; i ++)
		{
			var ad_tmp = JSON.parse(entrylist[i].adjustable_attribute);

			for (var prop in req.body.adjusts)
			{
				if (ad_tmp[prop])
				{
					entrylist[i].similarity += parseFloat(10 - (parseInt(ad_tmp[prop]) - parseInt(req.body.adjusts[prop]))) / 10 * 0.5;
				}
			}
		}

		// Sorting
		for (var i = 0; i < entrylist.length - 1; i ++)
			for (var j = i + 1; j < entrylist.length; j ++)
				if (entrylist[i].similarity < entrylist[j].similarity)
				{
					var tmp = entrylist[i];
					entrylist[i] = entrylist[j];
					entrylist[j] = tmp;
				}

		// Writing story
		if (entrylist.length == 0)
		{
			return res.status(201).json({success: false});
		}

		var story = entrylist[0].template;
		for (var i = 0; i < req.body.characters.length; i ++)
		{
			/*
				{{character/1-fname}}
				{{character/1-lname}}
				{{character/2-name}}
			*/

			story = replaceAll(story, "{{character/" + (i + 1) + "-fname}}", req.body.characters[i].firstname);
			story = replaceAll(story, "{{character/" + (i + 1) + "-lname}}", req.body.characters[i].lastname);
			story = replaceAll(story, "{{character/" + (i + 1) + "-name}}", req.body.characters[i].firstname + " " + req.body.characters[i].lastname);
		}

		return res.status(200).json({success: true, story: story});
	}

	// generate fiction
	app.post('/api/generate', function(req, res) {
		// Number of characters filter applied
		Template.find({character_count: req.body.characters.length}, function(err, entrylist) {
			if (err) throw err;

			if (entrylist.length == 0) {
				return res.status(201).json({success: false});
			}

			filterTemplate(req, res, entrylist);
		});
	});

	app.post('/api/auth', function(req, res) {
		if (!req.body.email)
		{
			return res.status(401).json({ success: false, message: 'Authentication failed.' });
		}

		// find the user
		User.findOne({'email': req.body.email, status: true}, function(err, user) {
			if (err) throw err;

			if (!user) {
				return res.status(201).json({ success: false, message: 'Authentication failed. User not found.' });
			} else if (user) {
				// check if password matches
				if (!isValidPassword(user, req.body.password)) {
					return res.status(201).json({ success: false, message: 'Authentication failed. Wrong password.' });
				} else {
					// if user is found and password is right
					// create a token
					var token = jwt.sign(user, app.get('superSecret'), {
						expiresInMinutes: 1440 // expires in 24 hours
					});

					// return the information including token as JSON
					res.status(200).json({
						success: true,
						message: 'Enjoy your token!',
						token: token,
						user: user
					});
				}
			}
		});
	});

	var isValidPassword = function(user, password){
		if (!user.password || !password)
			return false;
		return bCrypt.compareSync(password, user.password);
    }
}
