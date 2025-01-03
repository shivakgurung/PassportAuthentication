const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const session = require("express-session");


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    // passReqToCallback: false
},
    function (request, accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
        console.log(`request is ${request}, accessToken is ${accessToken}, refreshToken is ${refreshToken}, profile is ${profile}, done is ${done}`)
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))