var express = require('express');
var Template = require('../models/template.js');
var User = require('../models/user');

module.exports.controller = function(app) {
	
	var getTodayInFormat = function(){
		var today = new Date();
		
		var year = today.getFullYear();

		var month = today.getMonth() + 1;
		month = (month < 10 ? "0" : "") + month;

		var day  = today.getDate();
		day = (day < 10 ? "0" : "") + day;

		return year + "-" + month + "-" + day;
	}

	// add template
	app.post('/api/templates/add', function(req, res) {
		var entry = new Template(req.body);
		entry.userID = req.decoded._id; // set owner
		entry.status = true;
		entry.created = getTodayInFormat();

		entry.save(
			function(err){
				if (err){
					return res.status(201).json({ 
				        success: false, 
				        message: 'Bad Request.' 
				    });
				}

				return res.status(200).json({success: true, template: entry});
			}
		);
	});

	// getting the template list
	app.get('/api/templates/getList', function(req, res) {
		Template.find({}, function(err, entrylist) {
			if (err) throw err;

			if (entrylist.length == 0) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else {
				return res.status(200).json({success: true, templates: entrylist});
			}
		});
	});

	// getting the template information
	app.get('/api/templates/getInformationByID/:id', function(req, res) {
		if (!req.params.id)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		Template.findOne({_id: req.params.id}, function(err, entry) {
			if (err) throw err;

			if (!entry) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else if (entry) {
				return res.status(200).json({success: true, template: entry});
			}
		});
	});

	// update template
	app.post('/api/templates/updateByID/:id', function(req, res) {
		if (!req.params.id)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		var newEntry = req.body;
		Template.findOne({_id: req.params.id}, function(err, entry) {
			if (err) throw err;

			Template.update(
				{_id: req.params.id},
				{$set: newEntry},
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

	// delete entry, web token used
	app.get('/api/templates/deleteByID/:id', function(req, res) {
		if (!req.params.id)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		Template.findOne({_id: req.params.id}, function(err, entry) {
			if (err) throw err;
			
			entry.remove();
			return res.status(200).json({success: true});
		});
	});
}
