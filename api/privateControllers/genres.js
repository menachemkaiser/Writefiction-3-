var express = require('express');
var Genre = require('../models/genre.js');
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

	// add genre
	app.post('/api/genres/add', function(req, res) {
		var entry = new Genre(req.body);
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

				return res.status(200).json({success: true, genre: entry});
			}
		);
	});

	// getting the genre list
	app.get('/api/genres/getList', function(req, res) {
		Genre.find({}, function(err, entrylist) {
			if (err) throw err;

			if (entrylist.length == 0) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else {
				return res.status(200).json({success: true, genres: entrylist});
			}
		});
	});

	// getting the genre list
	app.get('/api/genres/getActiveList', function(req, res) {
		Genre.find({status: true}, function(err, entrylist) {
			if (err) throw err;

			if (entrylist.length == 0) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else {
				return res.status(200).json({success: true, genres: entrylist});
			}
		});
	});

	// getting the genre information
	app.get('/api/genres/getInformationByID/:id', function(req, res) {
		if (!req.params.id)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		Genre.findOne({_id: req.params.id}, function(err, entry) {
			if (err) throw err;

			if (!entry) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else if (entry) {
				return res.status(200).json({success: true, genre: entry});
			}
		});
	});

	// update genre
	app.post('/api/genres/updateByID/:id', function(req, res) {
		if (!req.params.id)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		var newEntry = req.body;
		Genre.findOne({_id: req.params.id}, function(err, entry) {
			if (err) throw err;

			Genre.update(
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
	app.get('/api/genres/deleteByID/:id', function(req, res) {
		if (!req.params.id)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		Genre.findOne({_id: req.params.id}, function(err, entry) {
			if (err) throw err;
			
			entry.remove();
			return res.status(200).json({success: true});
		});
	});
}
