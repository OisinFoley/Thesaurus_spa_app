var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');

var SynonymSchema = new Schema({
	name: { type:String, required:true },  
  	uuid: { type:String, required:true }  	
});

SynonymSchema.plugin(titlize, {
  paths: [ 'name' ]    
});

module.exports = mongoose.model('Synonym', SynonymSchema);