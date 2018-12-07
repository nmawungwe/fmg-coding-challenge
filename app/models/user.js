var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    firstname: { type: String,  require: true},
    surname: { type: String,  require: true},
    email: { type: String, lowercase: true, require: true, unique: true},
    username: { type: String, require: true, unique: true},
    password: { type: String, minlength: 5, require: true},
    color: { type: String, require: true},
    active: {type: Boolean, required:true, default:false},
    temporarytoken: {type: String, required: true}
});

UserSchema.pre('save', function (next) {
    var user = this;
    var salt = bcrypt.genSaltSync(10);
    bcrypt.hash(user.password, salt, null, function(err, hash){
        if (err) return next(err);
        user.password=hash;
        next();
    });
    
  });

  UserSchema.methods.comparePassword = function(password) {
      return bcrypt.compareSync(password, this.password);
       
  }

module.exports = mongoose.model('User',UserSchema);


