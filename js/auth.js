function Auth() {

    passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var User = include('model/usermodel.js');
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new LocalStrategy(function(username, password, done) {
        User.findOne({ _id: username }, function(err, user) {
            if (err) { 
                return done(err); 
            }
            if (!user) { 
                return done(null, false, { message: 'Unknown user ' + username }); 
            }
            user.comparePassword(password, function(err, isMatch) {
                if (err) 
                    return done(err);
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));
    
    this.passport = passport;
};

module.exports = Auth;