var express = require('express');
var Adjust = require('../models/adjust.js');
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

	// add adjust
	app.post('/api/adjusts/add', function(req, res) {
		var entry = new Adjust(req.body);
		entry.created = getTodayInFormat();
		entry.status = true;

		entry.save(
			function(err){
				if (err){
					return res.status(201).json({ 
				        success: false, 
				        message: 'Bad Request.' 
				    });
				}

				return res.status(200).json({success: true, adjust: entry});
			}
		);
	});

	// getting the adjust list
	app.get('/api/adjusts/getList', function(req, res) {
		Adjust.find({}, function(err, entrylist) {
			if (err) throw err;

			if (entrylist.length == 0) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else {
				return res.status(200).json({success: true, adjusts: entrylist});
			}
		});
	});

	// getting the adjust list
	app.get('/api/adjusts/getActiveList', function(req, res) {
		Adjust.find({status: true}, function(err, entrylist) {
			if (err) throw err;

			if (entrylist.length == 0) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else {
				return res.status(200).json({success: true, adjusts: entrylist});
			}
		});
	});

	// getting the adjust information
	app.get('/api/adjusts/getInformationByID/:id', function(req, res) {
		if (!req.params.id)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		Adjust.findOne({_id: req.params.id}, function(err, entry) {
			if (err) throw err;

			if (!entry) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else if (entry) {
				return res.status(200).json({success: true, adjust: entry});
			}
		});
	});

	// update adjust
	app.post('/api/adjusts/updateByID/:id', function(req, res) {
		if (!req.params.id)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		var newEntry = req.body;
		Adjust.findOne({_id: req.params.id}, function(err, entry) {
			if (err) throw err;

			Adjust.update(
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
	app.get('/api/adjusts/deleteByID/:id', function(req, res) {
		if (!req.params.id)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		Adjust.findOne({_id: req.params.id}, function(err, entry) {
			if (err) throw err;
			
			entry.remove();
			return res.status(200).json({success: true});
		});
	});
}
