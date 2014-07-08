function Auth() {

    passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var IbmIdStrategy = require('passport-ibmid-oauth2').Strategy;
    var User = include('model/usermodel.js');
    
    passport.serializeUser(function(user, done) {
        done(null, user);
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
                    return done(null, user._id);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));
    
    var port = (process.env.VCAP_APP_PORT || 3000);
    var host = (process.env.VCAP_APP_HOST || 'localhost');
    var url = JSON.parse(process.env.VCAP_APPLICATION || '{"uris":["' + 'https://' + host + ':' + port + '"]}').uris[0]
    var SSO_CLIENT_ID = (process.env.SSO_CLIENT_ID || ' ');
    var SSO_CLIENT_SECRET = (process.env.SSO_CLIENT_SECRET || ' ');
    
    passport.use('ibmid', new IbmIdStrategy({
        clientID: SSO_CLIENT_ID,
        clientSecret: SSO_CLIENT_SECRET,
        callbackURL: 'https://' + url + '/ibmid/callback',
        passReqToCallback: true
    }, 
    function(req, accessToken, refreshToken, profile, done) {
        req.session.ibmid = {};
        req.session.ibmid.profile = profile;
        console.log("profile: ", profile);
        return done(null, profile.userDisplayName[0]);
    }
    ));
    
    this.passport = passport;
};

module.exports = Auth;