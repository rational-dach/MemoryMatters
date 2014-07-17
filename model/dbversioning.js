//Versioning of Database for Upgrades
var mongoose = require('mongoose');
var async = require('async');
var Schema = mongoose.Schema;
var User = include('model/usermodel.js');

//change version number here
var currentDbVersion = 2;

//create user Schema
var DBVersionSchema = new Schema({
    _id:{ type: Number, min: 1, max: 1000 },
    description: String,
});

DBVersionSchema.statics.getVersion = function getVersion(cb) {

    var max = -1;
    mongoose.models["DBVersion"].findOne().sort('-_id').exec(function(err, doc){
        if(err || doc == null)
            max = -1;
        else 
            max = doc._id;
        cb(max);
    });		
};

DBVersionSchema.statics.createVersion = function(version,description,cb)
{
    //http://stackoverflow.com/questions/8987851/creating-methods-to-update-save-documents-with-mongoose
    var DBVersion = mongoose.model('DBVersion', DBVersionSchema);
    var v = new DBVersion();
    v._id = version;
    v.description = description;
    v.save(function(test){
        console.log("Save called");
        cb(version);
    });
}

DBVersionSchema.statics.V1 = function(version, cb)
{
    // create 1. version
    if(version < 1)
    {
        var DBVersion = mongoose.model('DBVersion', DBVersionSchema);
        DBVersion.createVersion(1,"Added Version Collection", function(version){
            cb(version);
        });
    }
    else
    {
        cb(version);
    }
}

DBVersionSchema.statics.V2 = function(version, cb)
{
    if(version == 1)
    {
        // create an ADMIN user by default
        var DBVersion = mongoose.model('DBVersion', DBVersionSchema);
        DBVersion.createVersion(2,"Added isAdmin Attribute, created default Admin/password User", function(version){
            var adminUser = new User({
                _id: 'admin'
                    , firstName: 'admin'
                        , lastName: 'admin'  
                            , email: 'admin@localhost'
                                , password: 'password'
                                    , isAdmin: true
            });
            adminUser.save(function(err, test){
                if (err) return console.error(err);
                console.dir(test);
                cb(version);
            });
        });
    }
    else
    {
        cb(version);
    }
}

DBVersionSchema.statics.upgradeDatabase = function upgradeDatabase(cb){
    var DBVersion = mongoose.model('DBVersion', DBVersionSchema);
    var version = null;
    async.waterfall(
            [
             function(callback){
                 DBVersion.getVersion(function(cb){
                     version = cb;
                     callback(null,version)
                 });
             },
             function(version, callback){
                 DBVersionSchema.statics.V1(version, function(cb){
                     version = cb;
                     callback(null,version);
                 });
             },
             function(version, callback){
                 DBVersionSchema.statics.V2(version, function(cb){
                     version = cb;
                     callback(null,version);
                 });
             },
             ],
             function (err, result) {
                console.log(result);
                cb(version);
            }
    );
}
module.exports = mongoose.model('DBVersion', DBVersionSchema);

