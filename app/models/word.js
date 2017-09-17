var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');
var Synonym    = require('../models/synonym');

var WordSchema = new Schema({
	name: { type:String, required:true },  
  	uuid: { type:String, required:true },
  	synonyms: { type:[Synonym], required:true	}    	
});

//If user enters a word in all lowercase letters then we will capitailse the first letter.
WordSchema.plugin(titlize, {
  paths: [ 'name' ]    
});

module.exports = mongoose.model('Word', WordSchema);