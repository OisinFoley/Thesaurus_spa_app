var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');

var SynonymSchema = new Schema({
	uuid: { type:String, required:true }, 	
	synonym: { type:String, required:true }   	
});

SynonymSchema.plugin(titlize, {
  paths: [ 'synonym' ]    
});

module.exports = mongoose.model('Synonym', SynonymSchema);