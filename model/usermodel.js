/**
 * New node file

 */
//mongoose driver
var mongoose = require('mongoose');
//encryption
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema; 

//create user Schema
var UserSchema = new Schema({
    _id:String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    isAdmin: { type: Boolean, default: false }
});

//store password always encrypted
UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    user.password = bcrypt.hashSync(user.password,bcrypt.genSaltSync(10));
    next();
});

//compare a password
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    console.log(this.password);
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//check for users unique id
UserSchema.statics.isUserIdUnique = function isUserIdUnique(id, cb) {
    var result = false;
    mongoose.models["User"].findById(id,function(err, user) {
        if(err) {
            console.log(err);
        } else if(user) {
            console.log("Not Unique");
            result = false;
        }
        else {
            console.log("Unique");
            result = true;
        }
        cb(result);
    });
};

module.exports = mongoose.model('User', UserSchema);
