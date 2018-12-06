var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    firstname: { type: String,  require: true},
    surname: { type: String,  require: true},
    email: { type: String, lowercase: true, require: true, unique: true},
    username: { type: String, require: true, unique: true},
    password: { type: String, require: true},
    color: { type: String, require: true}
});

UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash){
        if (err) return next(err);
        user.password=hash;
        next();
    });
    
  });

  UserSchema.methods.comparePassword = function(password) {
      return bcrypt.compareSync(password, this.password);
       
  }

module.exports = mongoose.model('User',UserSchema);


