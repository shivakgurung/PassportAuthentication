const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const session = require("express-session");
const { users } = require('../model');


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    // passReqToCallback: false
},
    async function (request, accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
        // console.log(`request is ${request}, accessToken is ${accessToken}, refreshToken is ${refreshToken}, profile is ${profile}, done is ${done}`)
        // console.log(`profile data are ${profile?.displayName}, ${profile?.name}, ${profile?.birthday}, ${profile?.placesLived}, ${profile?.isPerson}`)
        // return done(null, profile);
        try {
            let user = await users.findOne({ where: { email: profile.email } })
            if (!user) {
                user = new users({
                    username: profile.displayName,
                    email: profile.email,
                    // password: null,
                    googleId: profile.id,
                })
                await user.save()
            }
            if (!user.googleId) {
                user.googleId = profile.id
                await user.save()
            }
            return done(null, user, { message: "Logged in successfully." })
        } catch (error) {
            return done(error, null)
        }
    }
));

//Saves a small piece of user information in the session. like user id
passport.serializeUser((user, done) => {
    // console.log(`serialize user is ${user}`)
    done(null, user)
})

//Retrieves the full user details using the stored information.
passport.deserializeUser((user, done) => {
    // console.log(`Deserialize user is ${user}`)
    done(null, user)
})