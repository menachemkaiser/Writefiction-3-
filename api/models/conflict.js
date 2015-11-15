var mongoose = require('mongoose');

module.exports = mongoose.model('Conflict', {
	name: String, 

	created: String, 
    status: Boolean
});
