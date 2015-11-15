var mongoose = require('mongoose');

module.exports = mongoose.model('Genre', {
	name: String, 

	created: String, 
    status: Boolean
});
