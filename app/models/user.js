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

UserSchema.pre('save', function(next) {  
  var user = this; 
  bcrypt.hash(user.password,null,null, function(err,hash){ //encrypts for sending and storing
      if(err) return next(err);
      user.password = hash;
      next(); //after hashing, middleware knows to exit
  });
  
});




UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password); // this.password being the hashed password stored away 
}

module.exports = mongoose.model('User', UserSchema);