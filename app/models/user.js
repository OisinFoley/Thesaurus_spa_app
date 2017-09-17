var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');

var UserSchema = new Schema({    
  username: { type:String, lowercase:true, required:true, unique:true }, 
  email: { type:String, lowercase:true, required:true, unique:true },
  password: { type:String, required:true },  
  uuid: { type:String, required:true }  
});

module.exports = mongoose.model('User', UserSchema);