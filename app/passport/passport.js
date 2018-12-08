
var FacebookStrategy = require('passport-facebook').Strategy;
var User             = require('../models/user');
var session = require('express-session')

module.exports =function(app, passport){

        app.use(passport.initialize());
        app.use(passport.session());
        app.use(session({secret: 'keyboard cat',resave: false,saveUninitialized: true,cookie: { secure: false }}));

        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });
        
        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
            done(err, user);
            });
        });

    passport.use(new FacebookStrategy({
        clientID: '1015151472002039',
        clientSecret: '0cc3d69da1ea559b4c44d1cf93516b1b',
        callbackURL: "http://localhost:8080/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      function(accessToken, refreshToken, profile, done) {
          console.log(profile._json.email); 
  
      }
    ));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }));


    app.get('/auth/facebook',passport.authenticate('facebook', { scope: 'email' }));

    return passport;
}