var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');
var Synonym    = require('../models/synonym').SynonymSchema;

var WordSchema = new Schema({
	uuid: { type:String, required:true },
	baseWord: { type:String, required:true },    	
  	synonyms: { type:[Synonym], required:true, unique:true	}    	
  	// synonyms: { type:String, required:false	}    	  	
});

//If user enters a word in all lowercase letters then we will capitailse the first letter.
WordSchema.plugin(titlize, {
  paths: [ 'baseWord' ]    
});

module.exports = mongoose.model('Word', WordSchema);