var mongoose = require('mongoose');

module.exports = mongoose.model('Template', {
	userID: String, 

	template: String, 
	
	genres: String, 
	conflicts: String, 
	character_count: Number, 
	adjustable_attribute: String,
	
	created: String, 
    status: Boolean
});
