var express = require('express');
var Conflict = require('../models/conflict.js');
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

	// add conflict
	app.post('/api/conflicts/add', function(req, res) {
		var entry = new Conflict(req.body);
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

				return res.status(200).json({success: true, conflict: entry});
			}
		);
	});

	// getting the conflict list
	app.get('/api/conflicts/getList', function(req, res) {
		Conflict.find({}, function(err, entrylist) {
			if (err) throw err;

			if (entrylist.length == 0) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else {
				return res.status(200).json({success: true, conflicts: entrylist});
			}
		});
	});

	// getting the conflict list
	app.get('/api/conflicts/getActiveList', function(req, res) {
		Conflict.find({status: true}, function(err, entrylist) {
			if (err) throw err;

			if (entrylist.length == 0) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else {
				return res.status(200).json({success: true, conflicts: entrylist});
			}
		});
	});

	// getting the conflict information
	app.get('/api/conflicts/getInformationByID/:id', function(req, res) {
		if (!req.params.id)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		Conflict.findOne({_id: req.params.id}, function(err, entry) {
			if (err) throw err;

			if (!entry) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else if (entry) {
				return res.status(200).json({success: true, conflict: entry});
			}
		});
	});

	// update conflict
	app.post('/api/conflicts/updateByID/:id', function(req, res) {
		if (!req.params.id)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		var newEntry = req.body;
		Conflict.findOne({_id: req.params.id}, function(err, entry) {
			if (err) throw err;

			Conflict.update(
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
	app.get('/api/conflicts/deleteByID/:id', function(req, res) {
		if (!req.params.id)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		Conflict.findOne({_id: req.params.id}, function(err, entry) {
			if (err) throw err;
			
			entry.remove();
			return res.status(200).json({success: true});
		});
	});
}
