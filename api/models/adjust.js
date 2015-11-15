var mongoose = require('mongoose');

module.exports = mongoose.model('Adjust', {
	name: String, 

	created: String, 
    status: Boolean
});
