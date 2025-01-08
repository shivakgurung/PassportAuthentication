// import passport from "passport";
// import { Strategy } from "passport-local"
// import userList from "../Data/userList.js"

const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const userList = require("../Data/userList.js");


//new Strategy is an object with 3 properties: username, password and passReqToCallback
// export default 
passport.use(new Strategy({ usernameField: "email" },
    (email, password, done) => {
        console.log("inside passport local stratum")
        console.log(` email is ${email}, password is ${password}`)
        try {
            const user = userList.find(user => user.email === email && user.password === password);
            if (!user) return done(null, false, { message: "Invalid credentials" })
            console.log(`user is ${user}`)
            return done(null, user, { message: "Logged in successfully" })
        }
        catch (err) {
            return done(err, false, { message: "Server Error" })
        }
    }
))


passport.serializeUser((user, done) => {
    // Save user id in session
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // Find user by id and pass it to done
    const user = userList.find(user => user.id === id);
    done(null, user || false);
});